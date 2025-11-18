import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator'

export class LoginPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string

    @IsString()
    @IsNotEmpty()
    challengeToken: string
}
