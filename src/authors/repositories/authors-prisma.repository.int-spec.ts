import { NotFoundError } from '@/shared/errors/not-found-error'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { AuthorsPrismaRepository } from './authors-prisma.repository'
import { AuthorDataBuilder } from '../helpers/author-data-builder'

describe('AuthorsPrismaRepository Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
  })

  beforeEach(async () => {
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prisma.$disconnect()
  })

  test('should throw an error when the id is not found', async () => {
    const uuid = 'd628e44c-1ba2-4a39-b52d-2406d1602485'
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Author not found using ID ${uuid}`),
    )
  })

  test('should find an author by id', async () => {
    const data = AuthorDataBuilder({})

    const author = await prisma.author.create({
      data,
    })

    const result = await repository.findById(author.id)
    expect(result).toStrictEqual(author)
  })

  test('should create a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await repository.create(data)

    const result = await repository.findById(author.id)
    expect(result).toMatchObject(author)
  })

  test('should throw an error when updating a author not found', async () => {
    const uuid = 'd628e44c-1ba2-4a39-b52d-2406d1602485'
    const data = AuthorDataBuilder({})
    const author = {
      id: uuid,
      ...data,
    }
    await expect(repository.update(author)).rejects.toThrow(
      new NotFoundError(`Author not found using ID ${uuid}`),
    )
  })

  test('should update a author', async () => {
    const data = AuthorDataBuilder({})

    const author = await prisma.author.create({ data })

    const result = await repository.update({
      ...author,
      name: 'new name',
    })
    expect(result.name).toBe('new name')
  })

  test('should throw an error when deleting a author not found', async () => {
    const uuid = 'd628e44c-1ba2-4a39-b52d-2406d1602485'
    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(`Author not found using ID ${uuid}`),
    )
  })

  test('should delete a author', async () => {
    const data = AuthorDataBuilder({})
    const author = await prisma.author.create({ data })
    const result = await repository.delete(author.id)
    expect(result).toBeUndefined()
  })

  test('should return null when it does not find an author with the email provided', async () => {
    const result = await repository.findByEmail('a@a.com')
    expect(result).toBeNull()
  })

  test('should return a author in email search', async () => {
    const data = AuthorDataBuilder({ email: 'a@a.com' })
    const author = await prisma.author.create({ data })
    const result = await repository.findByEmail('a@a.com')
    expect(result).toMatchObject(author)
  })

  describe('search method', () => {
    test('should only apply pagination when the parameters are null', async () => {
      const createdAt = new Date()
      const data = []
      const arrange = Array(16).fill(AuthorDataBuilder({}))
      arrange.forEach((element, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...element,
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prisma.author.createMany({ data })
      const result = await repository.search({})

      expect(result.total).toBe(16)
      expect(result.items.length).toBe(15)
      result.items.forEach(item => {
        expect(item.id).toBeDefined()
      })

      result.items.reverse().forEach((item, index) => {
        expect(item.email).toEqual(`author${index + 1}@a.com`)
      })
    })

    test('should apply pagination and ordering', async () => {
      const createdAt = new Date()
      const data = []
      const arrange = 'badec'
      arrange.split('').forEach((element, index) => {
        const timestamp = createdAt.getTime() + index
        data.push({
          ...AuthorDataBuilder({ name: element }),
          email: `author${index}@a.com`,
          createdAt: new Date(timestamp),
        })
      })

      await prisma.author.createMany({ data })
      const result1 = await repository.search({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      })

      expect(result1.items[0]).toMatchObject(data[1])
      expect(result1.items[1]).toMatchObject(data[0])

      const result2 = await repository.search({
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
      })

      expect(result2.items[0]).toMatchObject(data[4])
      expect(result2.items[1]).toMatchObject(data[2])
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
      const result1 = await repository.search({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(result1.items[0]).toMatchObject(data[0])
      expect(result1.items[1]).toMatchObject(data[4])

      const result2 = await repository.search({
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      })

      expect(result2.items[0]).toMatchObject(data[2])
      expect(result2.items.length).toBe(1)
    })
  })
})
