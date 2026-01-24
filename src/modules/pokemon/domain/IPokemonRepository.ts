import { Pokemon } from './entity/pokemon.entity';

export interface IPokemonRepository {
  findAll(filter?: Partial<Pokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },): Promise<Pokemon[]>;
  save(pokemon: Pokemon): Promise<Pokemon>;
  update(id: number, pokemon: Partial<Pokemon>): Promise<Pokemon>;
  delete(id: number): Promise<Boolean>;
}

export const POKEMON_REPOSITORY = Symbol('POKEMON_REPOSITORY');