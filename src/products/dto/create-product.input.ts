import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator'

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

    @Field()
    @IsNumber()
    @IsNotEmpty()
    price: number

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
