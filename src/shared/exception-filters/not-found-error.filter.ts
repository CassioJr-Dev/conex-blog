import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql'
import { NotFoundError } from '../errors/not-found-error'
import { ArgumentsHost, Catch } from '@nestjs/common'
import { GraphQLError } from 'graphql'

@Catch(NotFoundError)
export class NotFoundErrorFilter implements GqlExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const ctx = gqlHost.getContext()
    return new GraphQLError(exception.message, {
      extensions: {
        code: 'Not Found',
        statusCode: 404,
      },
    })
  }
}
