import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PokemonService } from '../../application/pokemon.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { FilterPokemonDto } from './dto/filter-pokemon.dto';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@/config/cache-interceptor';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) { }

  @UseInterceptors(HttpCacheInterceptor)
  @Query('getPokemons')
  async getPokemons(
    @Args("filter") filter?: FilterPokemonDto,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
    @Args('sort') sort?: { field: string; order: 'ASC' | 'DESC' },

  ) {
    return this.pokemonService.getPokemons(PokemonMapper.fromDtoToDomain(filter), offset, limit, sort);
  }

  @Mutation('createPokemon')
  async createPokemon(@Args('input') pokemon: CreatePokemonDto) {
    return this.pokemonService.createPokemon(pokemon.name, pokemon.types);
  }

  @Mutation('updatePokemon')
  async updatePokemon(@Args('input') pokemon: UpdatePokemonDto) {
    return this.pokemonService.updatePokemon(pokemon.id, pokemon);
  }

  @Mutation('deletePokemon')
  async deletePokemon(@Args('id') id: number) {
    return this.pokemonService.deletePokemon(id);
  }
}
