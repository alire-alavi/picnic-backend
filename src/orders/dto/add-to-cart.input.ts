import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class AddItemToCartInput {
    @Field()
    productId: string

    @Field(() => Int, { defaultValue: 1 })
    quantity: number
}
