import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPokemonRepository } from '@modules/pokemon/domain/IPokemonRepository';
import { PokemonMapper } from '../mapper/pokemon.mapper';
import { Pokemon as DomainPokemon } from '@/modules/pokemon/domain/entity/pokemon.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPokemonRepository implements IPokemonRepository {
  private readonly SKIP_DEFAULT = Number(process.env.PRISMA_SKIP_DEFAULT) || 0;
  private readonly TAKE_DEFAULT = Number(process.env.PRISMA_TAKE_DEFAULT) || 20;

  constructor(private prisma: PrismaService) {}

  async findAll(filter?: Partial<DomainPokemon>, offset?: number, limit?: number, sort?: { field: string; order: 'ASC' | 'DESC' }): Promise<DomainPokemon[]> {
    try {
      const rawPokemons = await this.prisma.pokemon.findMany({
        where: {
          name: filter?.name ? { contains: filter.name } : undefined,
          ...(filter?.types?.length ? {
            types: { some: { name: { in: filter.types.map(({ name }) => name) } } }
          } : {}),
        },
        orderBy: sort?.field ? { [sort.field]: sort.order?.toLowerCase() || 'asc' } : { name: 'asc' },
        skip: offset || this.SKIP_DEFAULT,
        take: limit || this.TAKE_DEFAULT,
        include: { types: true }
      });
      return rawPokemons.map(PokemonMapper.toDomain);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch pokemons');
    }
  }

  async save(pokemon: DomainPokemon): Promise<DomainPokemon> {
    try {
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
    } catch (error) {
      
      throw new InternalServerErrorException('Error saving pokemon');
    }
  }

  async update(id: number, pokemon: Partial<Omit<DomainPokemon, "id">>): Promise<DomainPokemon> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException(`Pokemon with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Error updating pokemon');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.pokemon.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException(`Delete Failed: Pokemon with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Error deleting pokemon');
    }
  }
}