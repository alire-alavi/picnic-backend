import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, IsArray, ArrayUnique } from 'class-validator'

@InputType()
export class UpdateProductImagesInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    thumbnailId?: string

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    sliderImageIds?: string[]
}
