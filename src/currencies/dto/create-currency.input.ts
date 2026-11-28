import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class CreateCurrencyInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    code: string

    @Field()
    @IsString()
    @IsNotEmpty()
    name: string

    @Field()
    @IsString()
    @IsNotEmpty()
    symbol: string

    @Field(() => Int, { defaultValue: 2 })
    @IsInt()
    @IsOptional()
    decimalPlaces?: number

    @Field({ defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}
