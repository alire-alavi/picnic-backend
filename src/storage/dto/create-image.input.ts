import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ImageSize } from '../models/image.model'
import { GraphQLUpload, FileUpload } from 'graphql-upload-minimal'

@InputType()
export class CreateImageInput {
    @Field(() => GraphQLUpload)
    file: Promise<FileUpload>

    @Field(() => ImageSize, { defaultValue: ImageSize.LARGE })
    @IsEnum(ImageSize)
    @IsOptional()
    size?: ImageSize

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    altText?: string
}
