import { Controller, Get } from '@nestjs/common'

@Controller()
export class HelloWordController {
  @Get()
  helloWord() {
    return 'Hello Word!'
  }
}
