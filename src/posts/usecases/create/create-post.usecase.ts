import { AuthorsPrismaRepository } from '@/authors/repositories/authors-prisma.repository'
import { PostOutput } from '@/posts/dto/post-output'
import { Post } from '@/posts/graphql/models/post'
import { PostsPrismaRepository } from '@/posts/repositories/posts-prisma.repository'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'
import slugify from 'slugify'

export namespace CreatePost {
  export type Input = {
    title: string
    content: string
    authorId: string
  }

  export type Output = PostOutput

  export class UseCase {
    constructor(
      private postsRepository: PostsPrismaRepository,
      private authorsRepository: AuthorsPrismaRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { title, content, authorId } = input

      if (!content || !title || !authorId) {
        throw new BadRequestError('Input data not provided')
      }

      await this.authorsRepository.get(authorId)

      const slug = slugify(title, { lower: true })
      const slugExists = await this.postsRepository.findBySlug(slug)

      if (slugExists) {
        throw new ConflictError('Title used by other post')
      }

      const post = (await this.postsRepository.create({
        ...input,
        slug,
      })) as Required<Post>

      return post
    }
  }
}
