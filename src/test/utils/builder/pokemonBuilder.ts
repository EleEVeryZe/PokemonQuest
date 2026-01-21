import { Pokemon } from '@/modules/pokemon/domain/pokemon.entity';
import { Builder } from './builder';

export class PokemonBuilder implements Builder<Pokemon> {
  private id = 1;
  private name = 'Pikachu';
  private type = 'Electric';
  private createdAt = new Date();

  static get(): PokemonBuilder {
    return new PokemonBuilder();
  }

  aCharizard(): this {
    this.name = 'charizard';
    this.type = 'FIRE';
    return this;
  }

  withType(type: string): this {
    this.type = type;
    return this;
  }

  withId(id: number): this {
    this.id = id;
    return this;
  }

  build(): Pokemon {
    return new Pokemon(
      this.id,
      this.name,
      this.type,
      this.createdAt,
    );
  }
}