import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

@InputType()
export class ProductPriceInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    currencyId: string

    @Field()
    @IsNumber()
    @IsNotEmpty()
    amount: number
}
