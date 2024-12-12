import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class CreatePostInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @Field()
  title: string

  @IsString()
  @IsNotEmpty()
  @Field()
  content: string

  @IsString()
  @IsNotEmpty()
  @Field()
  authorId: string
}
