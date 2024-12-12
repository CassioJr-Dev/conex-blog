import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

@ArgsType()
export class SearchParamsArgs {
  @MinLength(1)
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page?: number

  @MinLength(1)
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  perPage?: number

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  sort?: string

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  sortDir?: 'asc' | 'desc'

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  filter?: string
}
