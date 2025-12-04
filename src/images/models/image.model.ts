import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'

@ObjectType()
export class Image extends AbstractModel {
  @Field()
  url: string

  @Field()
  md: string

  @Field()
  sm: string

  @Field({ nullable: true })
  altText?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
