import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppResolver } from './app.resolver'
import { AuthorsModule } from './authors/authors.module'
import { DatabaseModule } from './database/database.module'
import { PostsModule } from './posts/posts.module'
import path from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
      formatError: error => {
        const originalError = error?.extensions?.originalError
        if (originalError) {
          return {
            message: error.message,
            extensions: {
              ...(originalError as any),
            },
          }
        }

        return {
          message: error.message,
          extensions: {
            code: error.extensions.code || 'INTERNAL_SERVER_ERROR',
            statusCode:
              error.extensions.code === 'GRAPHQL_VALIDATION_FAILED'
                ? 422
                : error.extensions.statusCode || 500,
          },
        }
      },
    }),
    AuthorsModule,
    PostsModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
