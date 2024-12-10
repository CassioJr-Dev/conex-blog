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
    }),
    AuthorsModule,
    PostsModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
