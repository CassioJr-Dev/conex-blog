import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { AuthorsResolver } from './graphql/resolvers/authors.resolver'
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository'
import { ListAuthor } from './usecases/list/list-authors.usecase'
import { GetAuthor } from './usecases/get/get-author.usecase'
import { CreateAuthor } from './usecases/create/create-author.usecase'
import { UpdateAuthor } from './usecases/update/update-author.usecase'
import { DeleteAuthor } from './usecases/delete/delete-author.usecase'

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
    {
      provide: GetAuthor.UseCase,
      useFactory: (authorsRepository: AuthorsPrismaRepository) => {
        return new GetAuthor.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: CreateAuthor.UseCase,
      useFactory: (authorsRepository: AuthorsPrismaRepository) => {
        return new CreateAuthor.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: UpdateAuthor.UseCase,
      useFactory: (authorsRepository: AuthorsPrismaRepository) => {
        return new UpdateAuthor.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
    {
      provide: DeleteAuthor.UseCase,
      useFactory: (authorsRepository: AuthorsPrismaRepository) => {
        return new DeleteAuthor.UseCase(authorsRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class AuthorsModule {}
