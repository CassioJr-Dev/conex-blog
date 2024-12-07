import { PaginationOutput } from '@/shared/dto/pagination-output'
import { AuthorsPrismaRepository } from '../../repositories/authors-prisma.repository'
import { SearchInput } from '@/shared/dto/search-input'
import { AuthorOutput } from '@/authors/dto/author-output'

export namespace ListAuthor {
  export type Input = SearchInput

  export type Output = PaginationOutput<AuthorOutput>

  export class UseCase {
    constructor(private authorsRepository: AuthorsPrismaRepository) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.authorsRepository.search(input)
      return {
        items: searchResult.items,
        currentPage: searchResult.currentPage,
        perPage: searchResult.perPage,
        lastPage: searchResult.lastPage,
        total: searchResult.total,
      }
    }
  }
}
