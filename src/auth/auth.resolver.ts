import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@ObjectType()
class AuthLoginResponse {
  @Field()
  accessToken: string
}

@ObjectType()
class SendOtpResponse {
  @Field()
  success: boolean

  @Field()
  phoneNumber: string

  @Field({ nullable: true })
  error?: string
}

@Resolver()
export class AuthResolver {
  constructor(
    private jwt: JwtService,
    private authService: AuthService,
  ) { }

  @Mutation(() => AuthLoginResponse, { name: 'loginWithPassword' })
  async loginWithPassword(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthLoginResponse> {
    if (!email || !password)
      throw new BadRequestException('Invalid credentials')
    const user = await this.authService.loginWithPassword({ email, password })
    if (!user) throw new BadRequestException('Invalid credentials')
    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    }
    const accessToken = await this.jwt.signAsync(payload)
    return { accessToken }
  }

  @Mutation(() => SendOtpResponse, { name: 'loginWithPhoneNumber' })
  async loginWithPhoneNumber(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<SendOtpResponse> {
    if (!phoneNumber) throw new BadRequestException('phoneNumber is required')
    // Delegates to AuthService; implement provider integration there.
    const response = await this.authService.sendOtpToPhone(phoneNumber)
    return {
      success: response.success,
      error: response.error,
      phoneNumber: phoneNumber,
    }
  }

  @Mutation(() => AuthLoginResponse, { name: 'validateOtpAttempt' })
  async validateOtpAttempt(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: string,
  ): Promise<AuthLoginResponse> {
    const response = await this.authService.loginWithOtp({
      phoneNumber,
      otp: code,
    })
    if (response) {
      const payload = {
        sub: response.id,
        email: response.email,
        phoneNumber: response.phoneNumber,
        role: response.role,
      }
      const accessToken = await this.jwt.signAsync(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Invalid login attempt')
    }
  }
}
