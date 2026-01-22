import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPokemonRepository } from '@modules/pokemon/domain/IPokemonRepository';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { Pokemon as DomainPokemon } from '@modules/pokemon/domain/pokemon.entity';

@Injectable()
export class PrismaPokemonRepository implements IPokemonRepository {
  private readonly SKIP_DEFAULT = Number(process.env.PRISMA_SKIP_DEFAULT) || 0;
  private readonly TAKE_DEFAULT = Number(process.env.PRISMA_TAKE_DEFAULT) || 20;
  
  constructor(private prisma: PrismaService) { }

  async findAll(filter?: Partial<DomainPokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },): Promise<DomainPokemon[]> {
    const rawPokemons = await this.prisma.pokemon.findMany({
      where: {
        type: filter?.type,
        name: filter?.name ? {
          contains: filter.name,
        } : undefined,
      },
      orderBy: sort?.field ?
        {
          [sort.field]: sort.order?.toLowerCase() || 'asc'
        } : { name: 'asc' },
      skip: offset || this.SKIP_DEFAULT,
      take: limit || this.TAKE_DEFAULT,

    });
    return rawPokemons.map(PokemonMapper.toDomain)

  }

  save(pokemon: DomainPokemon): Promise<DomainPokemon> {
    throw new Error('Method not implemented.');
  }
}