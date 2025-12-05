import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class RemoveItemFromCartInput {
    @Field()
    productId: string
}
