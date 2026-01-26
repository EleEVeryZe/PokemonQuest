import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GraphQL');

  catch(exception: any, host: ArgumentsHost) {
    const isProduction = process.env.NODE_ENV === 'production';
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const req = context.req || context.request;

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = (typeof exceptionResponse === 'object' && exceptionResponse !== null)
      ? (exceptionResponse as any).message || exception.message
      : exception.message || 'Internal server error';

    const operationName = req?.body?.operationName || 'GraphQL Operation';
    if (status >= 500)
      this.logger.error(`[${operationName}] ${message}`, exception.stack);
    else 
      this.logger.warn(`[${operationName}] ${message}`);
    

    throw new GraphQLError(isProduction && status === 500 ? 'Internal server error' : message, {
      extensions: {
        code: exception?.code || 'INTERNAL_SERVER_ERROR',
        status: status,
        timestamp: new Date().toISOString(),
        ...(isProduction ? {} : { stack: exception.stack }),
      },
    });
  }
}