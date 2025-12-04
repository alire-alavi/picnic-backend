import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'

@InputType()
export class CreateImageInput {
    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    id?: string

    @Field()
    @IsString()
    url: string

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    altText?: string
}
