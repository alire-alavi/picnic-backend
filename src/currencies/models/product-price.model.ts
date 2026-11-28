import { Field, ObjectType } from '@nestjs/graphql'
import { Currency } from './currency.model'

@ObjectType()
export class ProductPrice {
    @Field()
    id: string

    @Field()
    productId: string

    @Field()
    currencyId: string

    @Field()
    amount: string

    @Field(() => Currency, { nullable: true })
    currency?: Currency
}
