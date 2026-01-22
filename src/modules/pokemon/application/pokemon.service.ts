import { Inject, Injectable } from "@nestjs/common";
import { IPokemonRepository, POKEMON_REPOSITORY } from "../domain/IPokemonRepository";
import { Pokemon } from "../domain/pokemon.entity";

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_REPOSITORY) private readonly repo: IPokemonRepository,
  ) {}

  async getPokemons(filter?: Partial<Pokemon>, offset?: number, limit?: number) {
    return this.repo.findAll(filter, offset, limit);
  }
}