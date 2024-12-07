import { Test, TestingModule } from '@nestjs/testing'
import { AuthorsPrismaRepository } from '../../repositories/authors-prisma.repository'
import { PrismaClient } from '@prisma/client'
import { ListAuthor } from './list-authors.usecase'
import { execSync } from 'node:child_process'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('ListAuthor UseCase Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  let usecase: ListAuthor.UseCase
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
    usecase = new ListAuthor.UseCase(repository)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prisma.$disconnect()
  })

  test('should only apply pagination when the parameters are null', async () => {
    const createdAt = new Date()
    const data = []
    const arrange = Array(3).fill(AuthorDataBuilder({}))
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...element,
        email: `author${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    await prisma.author.createMany({ data })
    const result = await usecase.execute({})

    expect(result).toMatchObject({
      items: data.reverse(),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  test('should apply pagination, filter and ordering', async () => {
    const createdAt = new Date()
    const data = []
    const arrange = ['test', 'a', 'TEST', 'b', 'Test']
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index
      data.push({
        ...AuthorDataBuilder({ name: element }),
        email: `author${index}@a.com`,
        createdAt: new Date(timestamp),
      })
    })

    await prisma.author.createMany({ data })
    const result1 = await usecase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(result1).toMatchObject({
      items: [data[0], data[4]],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })

    const result2 = await usecase.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(result2).toMatchObject({
      items: [data[2]],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    })
  })
})
