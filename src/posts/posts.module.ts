import { DatabaseModule } from '@/database/database.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PostsPrismaRepository } from './repositories/posts-prisma.repository'
import { CreatePost } from './usecases/create/create-post.usecase'
import { AuthorsPrismaRepository } from '@/authors/repositories/authors-prisma.repository'
import { GetPost } from './usecases/get/get-post.usecase'
import { PublishPost } from './usecases/publish/publish-post.usecase'
import { UnpublishPost } from './usecases/unpublish/unpublish-post.usecase'
import { PostsResolver } from './graphql/resolvers/posts.resolver'
import { GetAuthor } from '@/authors/usecases/get/get-author.usecase'

@Module({
  imports: [DatabaseModule],
  providers: [
    PostsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PostsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PostsPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AuthorsPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreatePost.UseCase,
      useFactory: (
        postsRepository: PostsPrismaRepository,
        authorsRepository: AuthorsPrismaRepository,
      ) => {
        return new CreatePost.UseCase(postsRepository, authorsRepository)
      },
      inject: ['PostsRepository', 'AuthorsRepository'],
    },
    {
      provide: GetPost.UseCase,
      useFactory: (postsRepository: PostsPrismaRepository) => {
        return new GetPost.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: PublishPost.UseCase,
      useFactory: (postsRepository: PostsPrismaRepository) => {
        return new PublishPost.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: UnpublishPost.UseCase,
      useFactory: (postsRepository: PostsPrismaRepository) => {
        return new UnpublishPost.UseCase(postsRepository)
      },
      inject: ['PostsRepository'],
    },
    {
      provide: GetAuthor.UseCase,
      useFactory: (authorRepository: AuthorsPrismaRepository) => {
        return new GetAuthor.UseCase(authorRepository)
      },
      inject: ['AuthorsRepository'],
    },
  ],
})
export class PostsModule {}
