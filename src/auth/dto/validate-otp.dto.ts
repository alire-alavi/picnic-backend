import { IsString, IsNotEmpty, Length } from 'class-validator'

export class ValidateOtpDto {
    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
    otp: string

    @IsString()
    @IsNotEmpty()
    challengeToken: string
}
