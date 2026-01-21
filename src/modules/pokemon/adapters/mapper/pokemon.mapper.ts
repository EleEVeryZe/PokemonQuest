import { Pokemon as PrismaPokemon } from '@prisma/client';
import { Pokemon as DomainPokemon } from '@modules/pokemon/domain/pokemon.entity';
import { Pokemon as GQLPokemon } from '@graphql.schema';

export class PokemonMapper {
  static toDomain({ id, name, type, createdAt }: PrismaPokemon): DomainPokemon {
    return new DomainPokemon(
      id,
      name,
      type,
      createdAt
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