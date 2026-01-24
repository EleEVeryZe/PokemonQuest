import { Pokemon as PrismaPokemon, Type as PrismaType } from '@prisma/client';
import { Pokemon as DomainPokemon } from '@/modules/pokemon/domain/entity/pokemon.entity';
import { Pokemon as GQLPokemon } from '@graphql.schema';
import { FilterPokemonDto } from '../web/dto/filter-pokemon.dto';
import { TypeEntity } from '../../domain/entity/pokemon-type.entity';

export class PokemonMapper {
  static toDomain(raw: PrismaPokemon & { types: PrismaType[] }): DomainPokemon {
    return new DomainPokemon(
      raw.id,
      raw.name,
      raw.types, 
      raw.createdAt
    );
  }

  static fromDtoToDomain(raw: FilterPokemonDto): DomainPokemon {
    return new DomainPokemon(
      0,
      raw?.name,
      raw?.types?.map(name => new TypeEntity(name, 0)), 
      undefined
    );
  }

  static toGraphQL({ id, name, types, createdAt }: DomainPokemon): GQLPokemon {
    return {
      id,
      name,
      types,
      createdAt: createdAt.toISOString(),
    };
  }
}