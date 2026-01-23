# PokemonQuest

 The application consists of a GraphQL API for management of pokemons. It is being developed with scallability, testability and separation of concern mindset.

## Technologies

- **Node.js** with **TypeScript**
- **NestJS** (Framework)
- **GraphQL** (API interface)
- **Prisma ORM** (persistence)
- **SQLite** (Database)
- **Jest and Supertest** (Unit and integraiton testing)

---

## Architecture

The project is being structured following **Hexagonal Archtecture**. This guarantees that if in the future, any technologies outside the domain gets modified, there will be no effort in changing the domain.

### File Structure:
- `domain/`: Domain classes
- `application/`: bridge from adpters and domain
- `adapters/`: Impleentation of Prisma, GraphQL resolvers

---

## How to run it?

### Required:
- Node.js (v18+)
- NPM ou Yarn

1. **Instale as dependências:**
   ```bash
   npm install
   npx prisma migrate dev
   npm run seed 
   npm run start:dev