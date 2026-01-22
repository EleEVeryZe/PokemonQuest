import { Inject, Injectable } from "@nestjs/common";
import { IPokemonRepository, POKEMON_REPOSITORY } from "../domain/IPokemonRepository";
import { Pokemon } from "../domain/pokemon.entity";

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_REPOSITORY) private readonly repo: IPokemonRepository,
  ) {}

  async getPokemons(filter?: Partial<Pokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },) {
    return this.repo.findAll(filter, offset, limit, sort);
  }

  async createPokemon(name: string, type: string) {
    return this.repo.save(new Pokemon(undefined, name, type, new Date()));
  }

  async updatePokemon(id: number, pokemon?: Partial<Omit<Pokemon, "id">>) {
    return this.repo.update(id, pokemon);
  }
}