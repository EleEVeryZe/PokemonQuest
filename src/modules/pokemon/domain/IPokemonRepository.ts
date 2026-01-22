import { Pokemon } from './pokemon.entity';

export interface IPokemonRepository {
  findAll(filter?: Partial<Pokemon>): Promise<Pokemon[]>;
  save(pokemon: Pokemon): Promise<Pokemon>;
}

export const POKEMON_REPOSITORY = Symbol('POKEMON_REPOSITORY');