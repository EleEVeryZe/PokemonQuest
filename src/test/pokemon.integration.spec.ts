import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

import { PokemonBuilder } from './utils/builder/pokemonBuilder';
import { PrismaService } from '@/modules/prisma/prisma.service';

describe('Pokemon GraphQL', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const pokemonBag = [
    PokemonBuilder.get().aCharizard(),
    PokemonBuilder.get().aBlastoise(),
    PokemonBuilder.get().aCharmeleon(),
    PokemonBuilder.get().aPikachu()
  ].map(p => p.build());

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await prisma.pokemon.deleteMany();
    await prisma.pokemon.createMany({
      data: pokemonBag,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return list of pokemons', async () => {
    const query = `
      query {
        getPokemons {
          name
          type
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.getPokemons[0].name).toBe(pokemonBag.at(0).name);
  });

  it('should filter pokemons by type', async () => {
    const query = `
      query GetByType($filterInput: PokemonFilter) {
        getPokemons(filter: $filterInput) {
          name
          type
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: { filterInput: { type: 'WATER' } },
      });

    const results = response.body.data.getPokemons;
    results.forEach(p => expect(p.type).toBe('WATER'));
  });

  it('should filter pokemons by partil name', async () => {
    const query = `
      query GetByType($filterInput: PokemonFilter) {
        getPokemons(filter: $filterInput) {
          name
          type
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: { filterInput: { name: "chu" } },
      });

    const results = response.body.data.getPokemons;
    results.forEach(p => {
      expect(p.type).toBe('Electric');
      expect(p.name.indexOf("chu") !== -1).toBeTruthy();
    });
  });

  it('should paginate results', async () => {
    const query = `
    query GetPaginated($offset: Int, $limit: Int) {
      getPokemons(offset: $offset, limit: $limit) {
        name
      }
    }
  `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: { offset: 1, limit: 2 },
      });

    const results = response.body.data.getPokemons;

    const [, blastoise, charmeleon] = pokemonBag;

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe(blastoise.name);
    expect(results[1].name).toBe(charmeleon.name);
  });
});