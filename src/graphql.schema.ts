
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePokemonInput {
    name: string;
    type: string;
}

export abstract class IQuery {
    abstract hellow(): string | Promise<string>;

    abstract hello(): number | Promise<number>;

    abstract getPokemon(id: number): Nullable<Pokemon> | Promise<Nullable<Pokemon>>;
}

export class Pokemon {
    id: number;
    name: string;
    type: string;
    createdAt: string;
}

export abstract class IMutation {
    abstract createPokemon(input: CreatePokemonInput): Pokemon | Promise<Pokemon>;
}

type Nullable<T> = T | null;
