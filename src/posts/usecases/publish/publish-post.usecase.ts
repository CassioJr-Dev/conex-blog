import { PostOutput } from '@/posts/dto/post-output'
import { PostsPrismaRepository } from '@/posts/repositories/posts-prisma.repository'

export namespace PublishPost {
  export type Input = {
    id: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(private postsRepository: PostsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const post = await this.postsRepository.findById(input.id)

      post.published = true
      const postUpdated = await this.postsRepository.update(post)

      return postUpdated as PostOutput
    }
  }
}
