import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsUUID } from 'class-validator'

@InputType()
export class UpdateCategoryInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    slug?: string

    @Field({ nullable: true })
    @IsUUID()
    @IsOptional()
    imageId?: string
}
