import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { SendOtpDto } from './dto/send-otp.dto'
import { ValidateOtpDto } from './dto/validate-otp.dto'
import { LoginPasswordDto } from './dto/login-password.dto'

interface LoginResponse {
    accessToken: string
    user: {
        id: string
        email: string | null
        phoneNumber: string | null
        name: string | null
    }
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwt: JwtService,
        private readonly authService: AuthService,
    ) { }

    @Post('send-otp')
    @HttpCode(HttpStatus.OK)
    async sendOtp(@Body() dto: SendOtpDto) {
        const result = await this.authService.sendOtpWithChallenge(
            dto.phoneNumber,
            dto.challengeToken,
        )
        return {
            success: result.success,
            message: result.success
                ? 'OTP sent successfully'
                : result.error || 'Failed to send OTP',
        }
    }

    @Post('validate-otp')
    @HttpCode(HttpStatus.OK)
    async validateOtp(@Body() dto: ValidateOtpDto): Promise<LoginResponse> {
        const { accessToken, user } = await this.authService.validateOtpWithChallenge(
            dto.phoneNumber,
            dto.otp,
            dto.challengeToken,
        )

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.name,
            },
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginPasswordDto): Promise<LoginResponse> {
        const { accessToken, user } = await this.authService.loginWithPasswordAndChallenge(
            dto.email,
            dto.password,
            dto.challengeToken,
        )

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.name,
            },
        }
    }
}
