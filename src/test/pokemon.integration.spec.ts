import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

import { PokemonBuilder } from './utils/builder/pokemonBuilder';
import { PrismaService } from '@/modules/prisma/prisma.service';

describe('Pokemon GraphQL', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const ascOrderedPokemonBag = [
    PokemonBuilder.get().aBlastoise(),
    PokemonBuilder.get().aCharizard(),
    PokemonBuilder.get().aCharmeleon(),
    PokemonBuilder.get().aPikachu()
  ].map(p => p.build());

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication().useGlobalPipes(new ValidationPipe());

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await prisma.pokemon.deleteMany();
    await prisma.pokemon.createMany({
      data: ascOrderedPokemonBag,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Queries", () => {
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
      expect(response.body.data.getPokemons[0].name).toBe(ascOrderedPokemonBag.at(0).name);
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

      const [, charizard, charmeleon] = ascOrderedPokemonBag;

      expect(results).toHaveLength(2);

      expect(results[0].name).toBe(charizard.name);
      expect(results[1].name).toBe(charmeleon.name);
    });

    it('should sort pokemons by name DESC', async () => {
      const query = `
    query GetSorted($sort: PokemonSort) {
      getPokemons(sort: $sort) {
        name
      }
    }
  `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query,
          variables: {
            sort: { field: 'name', order: 'DESC' }
          },
        });

      const results = response.body.data.getPokemons;

      expect(results[0].name.toLowerCase()).toBe('pikachu');
      expect(results[results.length - 1].name.toLowerCase()).toBe('blastoise');
    });

    it('should sort pokemons by name ASC without passing order', async () => {
      const query = `
    query GetSorted($sort: PokemonSort) {
      getPokemons(sort: $sort) {
        name
      }
    }
  `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query,
          variables: {
            sort: { field: 'name' }
          },
        });

      const results = response.body.data.getPokemons;

      expect(results[0].name.toLowerCase()).toBe('blastoise');
      expect(results[results.length - 1].name.toLowerCase()).toBe('pikachu');
    });
  });

  describe("Mutations", () => {
    it('should return validation error if type or name is missing', async () => {
      const mutation = `
        mutation Create($input: CreatePokemonInput!) {
          createPokemon(input: $input) { id }
        }
      `;

      const missinAllProp = { };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
          variables: { input: missinAllProp },
        });

      const errors = response.body.errors;
      const messages = errors[0].extensions.originalError.message;

      expect(messages).toContain("Your Pokemon must have a name");
      expect(messages).toContain("Your Pokemon must have a type");
    });

    it('should create a new pokemon in the database', async () => {
      const mutation = `
        mutation Create($input: CreatePokemonInput!) {
          createPokemon(input: $input) {
            id
            name
            type
          }
        }
      `;

      const blastoise = { name: 'blastoise', type: 'Electric' };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
          variables: { input: blastoise },
        });

      expect(response.status).toBe(200);
      const dbBlastoise = response.body.data.createPokemon;

      expect(dbBlastoise.name).toBe(blastoise.name);
      expect(dbBlastoise.id).toBeDefined();

      const dbCheck = await prisma.pokemon.findUnique({ where: { id: dbBlastoise.id } });
      expect(dbCheck).not.toBeNull();
    });
  });

});
