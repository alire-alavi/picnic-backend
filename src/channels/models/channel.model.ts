import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'
import { ChannelType as PrismaChannelType } from '@prisma/client'

// Re-export Prisma's ChannelType enum for GraphQL
export const ChannelType = PrismaChannelType

registerEnumType(ChannelType, {
  name: 'ChannelType',
  description: 'The type of sales channel',
})

@ObjectType()
export class Channel extends AbstractModel {
  @Field()
  name: string

  @Field()
  slug: string

  @Field(() => ChannelType)
  type: PrismaChannelType

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field()
  isActive: boolean

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
