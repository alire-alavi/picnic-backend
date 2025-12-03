import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ImageSize } from '../models/image.model'

@InputType()
export class CreateImageInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    id?: string

    @Field()
    @IsString()
    url: string

    @Field(() => ImageSize, { defaultValue: ImageSize.LARGE })
    @IsEnum(ImageSize)
    @IsOptional()
    size?: ImageSize

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    altText?: string
}
