import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator'

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

    @Field({ nullable: true })
    @IsOptional()
    @ValidateIf(o => !!o.email) // password required only if email present
    @MinLength(8)
    password?: string
}
