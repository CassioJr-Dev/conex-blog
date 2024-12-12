import { ArgumentsHost, Catch } from '@nestjs/common'
import { BadRequestError } from '../errors/bad-request-error'
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'

@Catch(BadRequestError)
export class BadRequestErrorFilter implements GqlExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const ctx = gqlHost.getContext()

    return new GraphQLError(exception.message, {
      extensions: {
        code: 'Bad Request',
        statusCode: 400,
      },
    })
  }
}
