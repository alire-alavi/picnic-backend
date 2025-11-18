import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phoneNumber?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string

    @Field({ nullable: true, description: 'Password is optional. Can be set later using setPassword mutation.' })
    @IsOptional()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password?: string
}
