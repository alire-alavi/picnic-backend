import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ImageSize } from '../models/image.model'

@InputType()
export class UpdateImageInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    url?: string

    @Field(() => ImageSize, { nullable: true })
    @IsEnum(ImageSize)
    @IsOptional()
    size?: ImageSize

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    altText?: string
}
