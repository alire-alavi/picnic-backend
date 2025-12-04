import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string

    @Field()
    @IsString()
    @IsNotEmpty()
    slug: string

    @Field({ nullable: true })
    @IsOptional()
    imageId?: string
}
