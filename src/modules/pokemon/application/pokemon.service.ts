import { Inject, Injectable } from "@nestjs/common";
import { IPokemonRepository, POKEMON_REPOSITORY } from "../domain/IPokemonRepository";
import { Pokemon } from "../domain/entity/pokemon.entity";
import { TypeEntity } from "../domain/entity/pokemon-type.entity";
import { PokemonMapper } from "../adapters/mapper/pokemon.mapper";

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_REPOSITORY) private readonly repo: IPokemonRepository,
  ) {}

  async getPokemons(filter?: Partial<Pokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },) {
    const pokemons = await this.repo.findAll(filter, offset, limit, sort);
    return pokemons.map(pokemon => PokemonMapper.toGraphQL(pokemon));
  }

  async createPokemon(name: string, types: TypeEntity[]) {
    return this.repo.save(new Pokemon(undefined, name, types, new Date()));
  }

  async updatePokemon(id: number, pokemon?: Partial<Omit<Pokemon, "id">>) {
    return this.repo.update(id, pokemon);
  }

  async deletePokemon(id: number) {
    return this.repo.delete(id);
  }
}