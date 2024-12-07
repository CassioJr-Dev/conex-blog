import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from '../../repositories/authors-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { GetAuthor } from './list-author.usecase'
import { execSync } from 'node:child_process'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('GetAuthor UseCase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let usecase: GetAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
    usecase = new GetAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prisma.$disconnect()
  })

  test('should throws an error when the id is not found', async () => {
    await expect(() =>
      usecase.execute({ id: 'd628e44c-1ba2-4a39-b52d-2406d1602485' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  test('should be able to get author by id', async () => {
    const data = AuthorDataBuilder({})
    const author = await prisma.author.create({ data })

    const result = await usecase.execute({ id: author.id })
    expect(result).toStrictEqual(author)
  })
})
