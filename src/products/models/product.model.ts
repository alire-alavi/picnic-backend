import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Product extends AbstractModel {
    @Field()
    name: string
    description: string
    price: string
}
