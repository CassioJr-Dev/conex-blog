import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthor } from '@/authors/usecases/list/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { CreateAuthor } from '@/authors/usecases/create/create-author.usecase'
import { CreateAuthorInput } from '../inputs/create-author.input'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthor.UseCase)
  private listAuthorUseCase: ListAuthor.UseCase

  @Inject(CreateAuthor.UseCase)
  private createAuthorUseCase: CreateAuthor.UseCase

  @Query(() => SearchAuthorsResult)
  authors(@Args() { page, perPage, sort, sortDir, filter }: SearchParamsArgs) {
    return this.listAuthorUseCase.execute({
      page,
      perPage,
      sort,
      sortDir,
      filter,
    })
  }

  @Mutation(() => Author)
  createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }
}
