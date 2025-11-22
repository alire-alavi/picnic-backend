import { Field, ObjectType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'

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

    @Field()
    seo_title: string

    @Field()
    seo_description: string

    @Field()
    seo_keywords: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
