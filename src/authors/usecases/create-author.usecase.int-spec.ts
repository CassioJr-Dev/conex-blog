import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from '../repositories/authors-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { CreateAuthor } from './create.author.usecase'
import { execSync } from 'node:child_process'
import { AuthorDataBuilder } from '../helpers/author-data-builder'
import { ConflictError } from '@/shared/errors/conflict-error'
import { BadRequestError } from '@/shared/errors/bad-request-error'

describe('CreateAuthor UseCase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let usecase: CreateAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
    usecase = new CreateAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prisma.$disconnect()
  })

  test('should create a author', async () => {
    const data = AuthorDataBuilder({})
    const author = await usecase.execute(data)

    expect(author.id).toBeDefined()
    expect(author.createdAt).toBeInstanceOf(Date)
    expect(author).toMatchObject(data)
  })

  test('should not be able to create with same email twice', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })
    await usecase.execute(data)

    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      ConflictError,
    )
  })

  test('should throwa error when name not provided', async () => {
    const data = AuthorDataBuilder({})
    data.name = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  test('should throwa error when email not provided', async () => {
    const data = AuthorDataBuilder({})
    data.email = null
    await expect(() => usecase.execute(data)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
