import { InputType, Field } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsUUID } from 'class-validator'

@InputType()
export class ProductsFilterInput {
    @Field()
    @IsOptional()
    @IsNumber()
    priceLte: number

    @Field()
    @IsOptional()
    @IsNumber()
    priceGte: number

    @Field()
    @IsOptional()
    @IsUUID()
    category: string
}
