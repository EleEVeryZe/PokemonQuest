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
    @Args('sort') sort?: { field: string; order: 'ASC' | 'DESC' },

  ) {
    return this.pokemonService.getPokemons(filter, offset, limit, sort);
  }
}
