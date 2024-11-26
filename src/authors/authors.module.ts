import { DatabaseModule } from '@/database/database.module'
import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'

@Module({
  imports: [DatabaseModule],
  providers: [AuthorsResolver],
})
export class AuthorsModule {}
