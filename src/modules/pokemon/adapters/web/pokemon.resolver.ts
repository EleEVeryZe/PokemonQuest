import { Resolver, Query, Args } from '@nestjs/graphql';
import { PokemonService } from '../../application/pokemon.service';
import { Pokemon } from '../../domain/pokemon.entity';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) { }

  @Query('getPokemons')
  async getPokemons(
    @Args("filter") filter?: Partial<Pokemon>,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,

  ) {
    return this.pokemonService.getPokemons(filter, offset, limit);
  }
}
