import { NotFoundError } from '@/shared/errors/not-found-error'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { AuthorsPrismaRepository } from './authors-prisma.repository'

describe('AuthorsPrismaRepository Integration Tests', () => {
  let module: TestingModule
  let repository: AuthorsPrismaRepository
  const prisma = new PrismaClient()

  beforeAll(async () => {
    execSync('npm run prisma:migratetest')
    await prisma.$connect()
    module = await Test.createTestingModule({}).compile()
    repository = new AuthorsPrismaRepository(prisma as any)
  }, 30000) // Timeout de 30 segundos

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
  }, 10000) // Timeout de 10 segundos
})
