import { Pokemon } from '@/modules/pokemon/domain/entity/pokemon.entity';
import { Builder } from './builder';
import { TypeEntity } from '@/modules/pokemon/domain/entity/pokemon-type.entity';

export class PokemonBuilder implements Builder<Pokemon> {
  private id?: number = undefined;
  private name = 'Pikachu';
  private types = ['Electric'];
  private createdAt = new Date();

  static get(): PokemonBuilder {
    return new PokemonBuilder();
  }

  aCharizard(): this {
    this.name = 'charizard';
    this.types = ['FIRE'];
    return this;
  }

  aPikachu(): this {
    this.name = 'pikachu';
    this.types = ['Electric'];
    return this;
  }

  aRaichu(): this {
    this.name = 'raichu';
    this.types = ['Electric'];
    return this;
  }

  aCharmeleon(): this {
    this.name = 'charmeleon';
    this.types = ['FIRE'];
    return this;
  }

  aBlastoise(): this {
    this.name = 'blastoise';
    this.types = ['WATER'];
    return this;
  }

  withType(type: string): this {
    this.types = [type];
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
      this.types.map(name => new TypeEntity(name, 0)),
      this.createdAt,
    );
  }
}