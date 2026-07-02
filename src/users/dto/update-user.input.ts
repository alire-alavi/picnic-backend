import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string
}
