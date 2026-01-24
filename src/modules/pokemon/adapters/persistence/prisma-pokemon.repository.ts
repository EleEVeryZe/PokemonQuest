import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPokemonRepository } from '@modules/pokemon/domain/IPokemonRepository';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { Pokemon as DomainPokemon } from '@/modules/pokemon/domain/entity/pokemon.entity';
import { FilterPokemonDto } from '../web/dto/filter-pokemon.dto';

@Injectable()
export class PrismaPokemonRepository implements IPokemonRepository {
  private readonly SKIP_DEFAULT = Number(process.env.PRISMA_SKIP_DEFAULT) || 0;
  private readonly TAKE_DEFAULT = Number(process.env.PRISMA_TAKE_DEFAULT) || 20;

  constructor(private prisma: PrismaService) { }

  async findAll(filter?: Partial<DomainPokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' },): Promise<DomainPokemon[]> {
    const rawPokemons = await this.prisma.pokemon.findMany({
      where: {
        name: filter?.name ? {
          contains: filter.name,
        } : undefined,
        ...(filter?.types?.length ? {
          types: {
            some: {
              name: { in: filter.types.map(({name}) => name) }
            }
          }
        } : {}),
      },
      orderBy: sort?.field ?
        {
          [sort.field]: sort.order?.toLowerCase() || 'asc'
        } : { name: 'asc' },
      skip: offset || this.SKIP_DEFAULT,
      take: limit || this.TAKE_DEFAULT,
      include: { types: true }

    });
    return rawPokemons.map(PokemonMapper.toDomain)
  }

  async save(pokemon: DomainPokemon): Promise<DomainPokemon> {
    const created = await this.prisma.pokemon.create({
      data: {
        name: pokemon?.name,
        types: pokemon?.types?.length ? {
          connectOrCreate: pokemon.types.map(({ name }) => ({
            where: { name },
            create: { name },
          })),
        } : {}
      },
      include: { types: true }
    });

    return PokemonMapper.toDomain(created);
  }

  async update(id: number, pokemon: Partial<Omit<DomainPokemon, "id">>): Promise<DomainPokemon> {
    const updated = await this.prisma.pokemon.update({
      where: { id },
      data: {
        name: pokemon?.name,
        types: pokemon?.types?.length ? {
          connectOrCreate: pokemon.types.map(({ name }) => ({
            where: { name },
            create: { name },
          })),
        } : {}
      },
      include: { types: true }
    });
    return PokemonMapper.toDomain(updated);
  }

  async delete(id: number): Promise<Boolean> {
    await this.prisma.pokemon.delete({
      where: { id }
    });
    return true;
  }
}