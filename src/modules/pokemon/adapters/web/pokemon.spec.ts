import { Test, TestingModule } from '@nestjs/testing';
import { PokemonResolver } from './pokemon.resolver';
import { PokemonService } from '../../application/pokemon.service';
import { Pokemon } from '../../domain/entity/pokemon.entity';
import { TypeEntity } from '../../domain/entity/pokemon-type.entity';

describe('PokemonResolver', () => {
  let resolver: PokemonResolver;
  let service: PokemonService;

  const mockPokemons: Pokemon[] = [
    new Pokemon(1, 'Pikachu', [new TypeEntity("Electric", undefined)], new Date()),
    new Pokemon(2, 'Bulbasaur', [new TypeEntity('Grass', undefined)], new Date()),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonResolver,
        {
          provide: PokemonService,
          useValue: {
            getPokemons: jest.fn().mockResolvedValue(mockPokemons),
          },
        },
      ],
    }).compile();

    resolver = module.get<PokemonResolver>(PokemonResolver);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPokemons', () => {
    it('should return an array of pokemons from the service', async () => {
      const result = await resolver.getPokemons();

      expect(result).toEqual(mockPokemons);
      expect(service.getPokemons).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no pokemons are found', async () => {
      jest.spyOn(service, 'getPokemons').mockResolvedValueOnce([]);

      const result = await resolver.getPokemons();

      expect(result).toEqual([]);
    });
  });
});