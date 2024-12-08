import { AuthorOutput } from '@/authors/dto/author-output'
import { AuthorsPrismaRepository } from '../../repositories/authors-prisma.repository'
import { Author } from '@/authors/graphql/models/author'
import { BadRequestError } from '@/shared/errors/bad-request-error'
import { ConflictError } from '@/shared/errors/conflict-error'

export namespace UpdateAuthor {
  export type Input = Partial<Author>

  export type Output = AuthorOutput

  export class UseCase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      if (!input?.id) {
        throw new BadRequestError('Id not provided')
      }
      const author = await this.authorsRepository.findById(input.id)

      if (input.email) {
        const emailExists = await this.authorsRepository.findByEmail(
          input.email,
        )
        if (emailExists && emailExists.id !== input.id) {
          throw new ConflictError('Email address used by other author')
        }
        author.email = input.email
      }

      if (input.name) {
        author.name = input.name
      }

      return this.authorsRepository.update(author)
    }
  }
}
