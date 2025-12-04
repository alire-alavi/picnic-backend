import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'
import { Image } from '../../images/models/image.model'
import { Channel } from '../../channels/models/channel.model'

@ObjectType()
export class Product extends AbstractModel {
  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  price: string

  @Field()
  categoryId: string

  @Field({ nullable: true })
  channelId?: string

  @Field(() => Channel, { nullable: true })
  channel?: Channel

  @Field()
  seo_title: string

  @Field()
  seo_description: string

  @Field()
  seo_keywords: string

  @Field(() => Image, { nullable: true })
  thumbnail?: Image

  @Field(() => [Image], { nullable: true })
  sliderImages?: Image[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
