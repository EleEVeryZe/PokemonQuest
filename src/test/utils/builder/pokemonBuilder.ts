import { Pokemon } from '@/modules/pokemon/domain/pokemon.entity';
import { Builder } from './builder';

export class PokemonBuilder implements Builder<Pokemon> {
  private id?: number = undefined;
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

  aPikachu(): this {
    this.name = 'Pikachu';
    this.type = 'Electric';
    return this;
  }

  aRaichu(): this {
    this.name = 'Raichu';
    this.type = 'Electric';
    return this;
  }

  aCharmeleon(): this {
    this.name = 'charmeleon';
    this.type = 'FIRE';
    return this;
  }

  aBlastoise(): this {
    this.name = 'blastoise';
    this.type = 'WATER';
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