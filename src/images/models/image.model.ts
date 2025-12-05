import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'

@ObjectType()
export class Image extends AbstractModel {
  @Field()
  url: string

  @Field({ nullable: true })
  md: string

  @Field({ nullable: true })
  sm: string

  @Field({ nullable: true })
  altText?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
