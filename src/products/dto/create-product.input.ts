import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ProductPriceInput } from '../../currencies/dto/product-price.input'

@InputType()
export class CreateProductInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string

    @Field()
    @IsString()
    @IsNotEmpty()
    slug: string

    @Field(() => [ProductPriceInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductPriceInput)
    prices: ProductPriceInput[]

    @Field()
    @IsString()
    @IsNotEmpty()
    seo_title: string

    @Field()
    @IsString()
    @IsNotEmpty()
    seo_description: string

    @Field()
    @IsString()
    @IsNotEmpty()
    seo_keywords: string

    @Field()
    @IsUUID()
    @IsNotEmpty()
    categoryId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID()
    channelId?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID()
    thumbnailId?: string
}
