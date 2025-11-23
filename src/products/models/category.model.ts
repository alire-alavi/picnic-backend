import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'
import { Image } from './image.model'

@ObjectType()
export class Category extends AbstractModel {
    @Field()
    name: string

    @Field()
    slug: string

    @Field(() => Image, { nullable: true })
    image?: Image

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
