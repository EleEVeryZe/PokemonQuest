import prisma from './prisma.client';
import { pokemons } from './data/pokemon';

async function main() {
  await prisma.pokemon.deleteMany();
  await prisma.type.deleteMany();

  
  for (const p of pokemons)
    await prisma.pokemon.create({
      data: {
        name: p.name,
        types: {
          connectOrCreate: p.type.map((typeName) => ({
            where: { name: typeName },
            create: { name: typeName },
          })),
        },
      },
    });
}

main()
  .catch((error) => {
    console.error('Error seeding the database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding completed successfully');
  });
