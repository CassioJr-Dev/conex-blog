import { NotFoundError } from '@/shared/errors/not-found-error'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { PostsPrismaRepository } from './posts-prisma.repository'
import { PostsDataBuilder } from '../helpers/posts-data-builder'
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder'

describe('PostsPrismaRepository Integration Tests', () => {
  let module: TestingModule
  let repository: PostsPrismaRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new PostsPrismaRepository(prisma as any)
  })

  beforeEach(async () => {
    await prisma.post.deleteMany()
    await prisma.author.deleteMany()
  })

  afterAll(async () => {
    await module.close()
    await prisma.$disconnect()
  })

  test('should throw an error when the id is not found', async () => {
    const uuid = 'd628e44c-1ba2-4a39-b52d-2406d1602485'
    await expect(repository.findById(uuid)).rejects.toThrow(
      new NotFoundError(`Post not found using ID ${uuid}`),
    )
  })

  test('should find a post by id', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: { id: author.id },
        },
      },
    })

    const result = await repository.findById(post.id)
    expect(result).toStrictEqual(post)
  })

  test('should find a post by id', async () => {
    const postData = PostsDataBuilder({})
    const authorData = AuthorDataBuilder({})
    const author = await prisma.author.create({ data: authorData })

    const result = await repository.create({ ...postData, authorId: author.id })
    expect(result).toMatchObject(postData)
  })
})