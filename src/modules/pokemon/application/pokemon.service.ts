import { Inject, Injectable } from "@nestjs/common";
import { IPokemonRepository, POKEMON_REPOSITORY } from "../domain/IPokemonRepository";

@Injectable()
export class PokemonService {
  constructor(
    @Inject(POKEMON_REPOSITORY) private readonly repo: IPokemonRepository,
  ) {}

  async getPokemons() {
    return this.repo.findAll();
  }
}