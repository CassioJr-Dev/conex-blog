import { PostOutput } from '@/posts/dto/post-output'
import { Post } from '@/posts/graphql/models/post'
import { PostsPrismaRepository } from '@/posts/repositories/posts-prisma.repository'

export namespace GetPost {
  export type Input = {
    id: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(private postsRepository: PostsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const post = (await this.postsRepository.findById(
        input.id,
      )) as Required<Post>

      return post
    }
  }
}
