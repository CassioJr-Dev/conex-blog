import { ArgsType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ArgsType()
export class AuthorIdArgs {
  @IsString()
  @Field()
  id: string
}
