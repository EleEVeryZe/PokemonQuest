import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

import { PokemonService } from '@/modules/pokemon/application/pokemon.service';
import { PokemonBuilder } from './utils/builder/pokemonBuilder';

describe('Pokemon GraphQL', () => {
  let app: INestApplication;
  let service: PokemonService;

  const mockCharizard = PokemonBuilder
    .get()
    .aCharizard()
    .build();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PokemonService)
      .useValue({
        getPokemons: jest.fn().mockResolvedValue([mockCharizard]),
        getDetails: jest.fn().mockResolvedValue(mockCharizard),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    service = moduleFixture.get<PokemonService>(PokemonService);
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
    expect(response.body.data.getPokemons[0].name).toBe(mockCharizard.name);
    
    expect(service.getPokemons).toHaveBeenCalled();
  });
});