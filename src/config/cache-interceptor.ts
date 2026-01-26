import {
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();

    if (!req?.body?.query) {
      return next.handle();
    }

    const query = req.body.query;
    const variables = JSON.stringify(req.body.variables ?? {});
    const hash = Buffer.from(query + variables).toString('base64');

    const version = (await this.cacheManager.get('pokemon:version') as Promise<number>) ?? 1;

    const cacheKey = `gql_cache_pokemon_v${version}_${hash}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) 
      return of(cached);
    

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response, 600);
      }),
    );
  }
}
