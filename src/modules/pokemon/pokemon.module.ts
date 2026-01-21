import { Module } from "@nestjs/common";
import { PokemonService } from "./application/pokemon.service";
import { POKEMON_REPOSITORY } from "./domain/IPokemonRepository";
import { PrismaPokemonRepository } from "./adapters/persistence/prisma-pokemon.repository";
import { PokemonResolver } from "./adapters/web/pokemon.resolver";
@Module({
  providers: [
    PokemonService,
    PokemonResolver,
    {
      provide: POKEMON_REPOSITORY,
      useClass: PrismaPokemonRepository,
    },
  ],
})
export class PokemonModule {}