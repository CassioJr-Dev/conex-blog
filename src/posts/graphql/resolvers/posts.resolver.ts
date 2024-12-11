import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Post } from '../models/post'
import { Inject } from '@nestjs/common'
import { CreatePost } from '@/posts/usecases/create/create-post.usecase'
import { CreatePostInput } from '../inputs/create-post.input'
import { GetAuthor } from '@/authors/usecases/get/get-author.usecase'

@Resolver(() => Post)
export class PostsResolver {
  @Inject(CreatePost.UseCase)
  private createPostUseCase: CreatePost.UseCase

  @Inject(GetAuthor.UseCase)
  private getAuthorUseCase: GetAuthor.UseCase

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput) {
    return this.createPostUseCase.execute(data)
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    return this.getAuthorUseCase.execute({ id: post.authorId })
  }
}
