import { Inject, Injectable } from "@nestjs/common";
import { IPokemonRepository, POKEMON_REPOSITORY } from "../domain/IPokemonRepository";
import { Pokemon } from "../domain/entity/pokemon.entity";
import { TypeEntity } from "../domain/entity/pokemon-type.entity";
import { PokemonMapper } from "../adapters/mapper/pokemon.mapper";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_REPOSITORY) private readonly repo: IPokemonRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async getPokemons(filter?: Partial<Pokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },) {
    const pokemons = await this.repo.findAll(filter, offset, limit, sort);
    return pokemons.map(pokemon => PokemonMapper.toGraphQL(pokemon));
  }

  async createPokemon(name: string, types: TypeEntity[]) {
    await this.clearAllPokemonCache();
    return this.repo.save(new Pokemon(undefined, name, types, new Date()));
  }

  async updatePokemon(id: number, pokemon?: Partial<Omit<Pokemon, "id">>) {
    await this.clearAllPokemonCache();
    return this.repo.update(id, pokemon);
  }

  async deletePokemon(id: number) {
    await this.clearAllPokemonCache();
    return this.repo.delete(id);
  }

  async clearAllPokemonCache() {
    const version = (await this.cacheManager.get<number>('pokemon:version')) ?? 1;
    await this.cacheManager.set('pokemon:version', version + 1);
  }

}