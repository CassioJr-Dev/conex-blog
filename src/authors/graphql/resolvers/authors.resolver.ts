import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject, UnprocessableEntityException } from '@nestjs/common'
import { ListAuthor } from '@/authors/usecases/list/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { CreateAuthor } from '@/authors/usecases/create/create-author.usecase'
import { CreateAuthorInput } from '../inputs/create-author.input'
import { GetAuthor } from '@/authors/usecases/get/get-author.usecase'
import { AuthorIdArgs } from '../args/author-id.args'
import { UpdateAuthor } from '@/authors/usecases/update/update-author.usecase'
import { UpdateAuthorInput } from '../inputs/update-author.input'
import { DeleteAuthor } from '@/authors/usecases/delete/delete-author.usecase'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthor.UseCase)
  private listAuthorUseCase: ListAuthor.UseCase

  @Inject(CreateAuthor.UseCase)
  private createAuthorUseCase: CreateAuthor.UseCase

  @Inject(GetAuthor.UseCase)
  private getAuthorUseCase: GetAuthor.UseCase

  @Inject(UpdateAuthor.UseCase)
  private updateAuthorUseCase: UpdateAuthor.UseCase

  @Inject(DeleteAuthor.UseCase)
  private deleteAuthorUseCase: DeleteAuthor.UseCase

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() { page, perPage, sort, sortDir, filter }: SearchParamsArgs,
  ) {
    return this.listAuthorUseCase.execute({
      page,
      perPage,
      sort,
      sortDir,
      filter,
    })
  }

  @Query(() => Author)
  async getAuthorById(@Args() { id }: AuthorIdArgs) {
    return this.getAuthorUseCase.execute({
      id,
    })
  }

  @Mutation(() => Author)
  async createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args('id') id: string,
    @Args('data') data: UpdateAuthorInput,
  ) {
    return this.updateAuthorUseCase.execute({ id, ...data })
  }

  @Mutation(() => Author)
  async deleteAuthor(@Args() { id }: AuthorIdArgs) {
    return this.deleteAuthorUseCase.execute({ id })
  }
}
