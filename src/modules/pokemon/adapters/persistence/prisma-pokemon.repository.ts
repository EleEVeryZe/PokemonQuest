import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPokemonRepository } from '@modules/pokemon/domain/IPokemonRepository';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { Pokemon as DomainPokemon } from '@modules/pokemon/domain/pokemon.entity';

@Injectable()
export class PrismaPokemonRepository implements IPokemonRepository {
  constructor(private prisma: PrismaService) { }

  async findAll(filter?: Partial<DomainPokemon>, offset?: number, limit?: number): Promise<DomainPokemon[]> {
    const rawPokemons = await this.prisma.pokemon.findMany({
      where: {
        type: filter?.type,
        name: filter?.name ? {
          contains: filter.name,
        } : undefined,
      },
      skip: offset || Number(process.env.PRISMA_SKIP_DEFAULT),
      take: limit || Number(process.env.PRISMA_TAKE_DEFAULT),

    });
    return rawPokemons.map(PokemonMapper.toDomain)

  }

  save(pokemon: DomainPokemon): Promise<DomainPokemon> {
    throw new Error('Method not implemented.');
  }
}