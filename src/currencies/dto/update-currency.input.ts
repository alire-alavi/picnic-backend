import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class UpdateCurrencyInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    symbol?: string

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    decimalPlaces?: number

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}
