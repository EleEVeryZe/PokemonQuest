
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}

export class TypesInput {
    id?: Nullable<number>;
    name: string;
}

export class UpdatePokemonInput {
    id: number;
    name?: Nullable<string>;
    types?: Nullable<Nullable<TypesInput>[]>;
}

export class CreatePokemonInput {
    name: string;
    types: TypesInput[];
}

export class PokemonFilter {
    name?: Nullable<string>;
    types?: Nullable<Nullable<string>[]>;
}

export class PokemonSort {
    field?: Nullable<string>;
    order?: Nullable<SortOrder>;
}

export class PokemonType {
    id?: Nullable<number>;
    name: string;
}

export class Pokemon {
    id: number;
    name: string;
    types?: Nullable<Nullable<PokemonType>[]>;
    createdAt: string;
}

export abstract class IQuery {
    abstract getPokemons(filter?: Nullable<PokemonFilter>, offset?: Nullable<number>, limit?: Nullable<number>, sort?: Nullable<PokemonSort>): Pokemon[] | Promise<Pokemon[]>;
}

export abstract class IMutation {
    abstract createPokemon(input: CreatePokemonInput): Pokemon | Promise<Pokemon>;

    abstract updatePokemon(input: UpdatePokemonInput): Pokemon | Promise<Pokemon>;

    abstract deletePokemon(id: number): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
