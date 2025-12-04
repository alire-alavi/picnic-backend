import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsUUID } from 'class-validator'

@InputType()
export class AddItemToCartInput {
    @Field()
    productId: string

    @Field(() => Int, { defaultValue: 1 })
    quantity: number

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID()
    channelId?: string
}
