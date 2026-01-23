import { Pokemon as PrismaPokemon, Type as PrismaType } from '@prisma/client';
import { Pokemon as DomainPokemon } from '@modules/pokemon/domain/pokemon.entity';
import { Pokemon as GQLPokemon } from '@graphql.schema';

export class PokemonMapper {
  static toDomain(raw: PrismaPokemon & { types: PrismaType[] }): DomainPokemon {
    return new DomainPokemon(
      raw.id,
      raw.name,
      raw.types?.pop()?.name, 
      raw.createdAt
    );
  }

  static toGraphQL({ id, name, type, createdAt }: DomainPokemon): GQLPokemon {
    return {
      id,
      name,
      type,
      createdAt: createdAt.toISOString(),
    };
  }
}