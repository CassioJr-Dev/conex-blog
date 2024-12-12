import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Post } from '../models/post'
import { Inject } from '@nestjs/common'
import { CreatePost } from '@/posts/usecases/create/create-post.usecase'
import { CreatePostInput } from '../inputs/create-post.input'
import { GetAuthor } from '@/authors/usecases/get/get-author.usecase'
import { GetPost } from '@/posts/usecases/get/get-post.usecase'
import { PostIdArgs } from '../args/post-id.args'
import { PublishPost } from '@/posts/usecases/publish/publish-post.usecase'

@Resolver(() => Post)
export class PostsResolver {
  @Inject(CreatePost.UseCase)
  private createPostUseCase: CreatePost.UseCase

  @Inject(GetAuthor.UseCase)
  private getAuthorUseCase: GetAuthor.UseCase

  @Inject(GetPost.UseCase)
  private getPostUseCase: GetPost.UseCase

  @Inject(PublishPost.UseCase)
  private publishPostUseCase: PublishPost.UseCase

  @Query(() => Post)
  async getPostById(@Args() { id }: PostIdArgs) {
    return this.getPostUseCase.execute({ id })
  }

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return this.createPostUseCase.execute(data)
  }

  @Mutation(() => Post)
  async publishPost(@Args() { id }: PostIdArgs) {
    return this.publishPostUseCase.execute({ id })
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    return this.getAuthorUseCase.execute({ id: post.authorId })
  }
}
