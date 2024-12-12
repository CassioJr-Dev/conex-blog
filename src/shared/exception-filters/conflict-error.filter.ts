import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ConflictError } from '../errors/conflict-error'
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch(ConflictError)
export class ConflictErrorFilter implements GqlExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const ctx = gqlHost.getContext()

    return new GraphQLError(exception.message, {
      extensions: {
        code: 'Conflict',
        statusCode: 409,
      },
    })
  }
}
