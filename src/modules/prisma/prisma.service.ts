import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly MAX_TAKE = Number(process.env.PRISMA_MAX_TAKE_DEFAULT) || 50;
  
  constructor() {
    super({ log: ['query'] });
  }
  async onModuleInit() {
    await this.$connect();
    Logger.log('Connected to Prisma', 'PrismaService');
  }

  async onModuleDestroy() {
    Logger.log('Closing Prisma Connection', 'PrismaService');
    await this.$disconnect();
  }

  readonly extended = this.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          if (!args.take || args.take > this.MAX_TAKE) {
            args.take = this.MAX_TAKE;
          }
          return query(args);
        },
      },
    },
  });
}
