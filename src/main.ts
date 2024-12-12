import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConflictErrorFilter } from './shared/exception-filters/conflict-error.filter'
import { NotFoundErrorFilter } from './shared/exception-filters/not-found-error.filter'
import { BadRequestErrorFilter } from './shared/exception-filters/bad-request-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: 422,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new BadRequestErrorFilter(),
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
