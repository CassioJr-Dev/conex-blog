import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository'
import { ListAuthor } from './usecases/list/list-authors.usecase'

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prisma: PrismaService) => {
        return new AuthorsPrismaRepository(prisma)
      },
      inject: ['PrismaService'],
    },
    {
      provide: ListAuthor.UseCase,
      useFactory: (authorsRepository: AuthorsPrismaRepository) => {
        return new ListAuthor.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class AuthorsModule {}
