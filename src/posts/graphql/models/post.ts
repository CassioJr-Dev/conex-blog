import { Field } from '@nestjs/graphql'

export class Post {
  @Field()
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  content: string

  @Field()
  authorId: string

  @Field()
  published?: boolean

  @Field()
  createdAt: Date
}
