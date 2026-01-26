import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { formatError } from "./config/format-error";
import { PokemonModule } from "@modules/pokemon/pokemon.module";
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: 'redis://localhost:6379',
          ttl: 60000,
        }),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
      formatError
    }),
    PokemonModule,
    PrismaModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./database/database_orm.sqlite",
      autoLoadEntities: true,
      synchronize: true,
      migrations: ["../typeorm/migrations/*.ts"],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
