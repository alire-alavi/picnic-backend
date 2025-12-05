import { Field, ObjectType, Int } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'

@ObjectType()
export class Currency extends AbstractModel {
    @Field()
    code: string

    @Field()
    name: string

    @Field()
    symbol: string

    @Field(() => Int)
    decimalPlaces: number

    @Field()
    isActive: boolean

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
