import { Resolver, Query, Args } from '@nestjs/graphql';
import { PokemonService } from '../../application/pokemon.service';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

@Query('getPokemons')
  async getPokemons() {
    return this.pokemonService.getPokemons();
  }
}
