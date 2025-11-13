import { Injectable, Inject } from '@nestjs/common'
import type { User } from '@prisma/client'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import {
  createKavenegarStrategyFromConfig,
  createSmsStrategy,
} from '../sms/kavenegar.strategy'
import type { SmsSendResult, SmsStrategy } from '../sms/strategy'
import { ConfigService } from '@nestjs/config'
import { timingSafeEqual, scryptSync, randomBytes } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'

interface LoginPasswordDto {
  email: string
  password: string
}

interface LoginOtpDto {
  phoneNumber: string
  otp: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
  ) {}
  private verifyPassword(password: string, stored: string): boolean {
    const [salt, key] = stored.split(':')
    const hash = scryptSync(password, salt, 64)
    return timingSafeEqual(Buffer.from(key, 'hex'), hash)
  }

  /**
   * Verifies a one-time password for a phone number.
   * Replace with real implementation (e.g., cached OTP or provider check).
   */
  async verifyOtp(phone: string, code: string): Promise<boolean> {
    // Placeholder implementation; replace with real OTP verification logic.
    // For now always false to indicate invalid until implemented.
    const stored = await this.cacheManager.get<string>(phone)
    if (!stored) {
      return false
    }
    const [salt, key] = stored.split(':')
    const hash = scryptSync(code, salt, 64)
    return timingSafeEqual(Buffer.from(key, 'hex'), hash)
  }

  private async storeOtp(phone: string, code: string): Promise<boolean> {
    // hash otp
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(code, salt, 64)
    const otpStore = `${salt}:${hash.toString('hex')}`
    const storeResult = await this.cacheManager.set(phone, otpStore, 90000)
    return true
  }

  /** Login via email + password. Returns User on success, null otherwise. */
  async loginWithPassword({
    email,
    password,
  }: LoginPasswordDto): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) return null
    return this.verifyPassword(password, user.passwordHash) ? user : null
  }

  /** Login via phone + OTP. Returns User on success, null otherwise. */
  async loginWithOtp({ phoneNumber, otp }: LoginOtpDto): Promise<User | null> {
    // phoneNumber is not unique in schema, so use findFirst
    const user = await this.prismaService.user.findFirst({
      where: { phoneNumber },
    })
    if (!user) return null
    const compare = await this.verifyOtp(phoneNumber, otp)
    return compare ? user : null
  }

  /** Sends an OTP to the provided phone number using configured SMS strategy. */
  async sendOtpToPhone(phoneNumber: string): Promise<SmsSendResult> {
    if (!phoneNumber)
      return { success: false, error: 'phoneNumber is required' }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    // TODO: persist OTP with TTL associated with phoneNumber for later verification

    const provider = (this.config.get<string>('SMS_PROVIDER') ||
      'kavenegar') as 'kavenegar'
    let strategy: SmsStrategy
    switch (provider) {
      case 'kavenegar':
        strategy = createKavenegarStrategyFromConfig(this.config)
        break
      default:
        strategy = createSmsStrategy({ provider: 'kavenegar', apiKey: '' })
        break
    }

    const result = await strategy.sendOtp(phoneNumber, otp)
    await this.storeOtp(phoneNumber, otp)
    return result
  }

  // Deprecated: prefer explicit loginWithPassword or loginWithOtp methods.
  async validateCredentials(
    emailPass?: LoginPasswordDto,
    phoneOTP?: LoginOtpDto,
  ): Promise<{ valid: boolean; user: User | null }> {
    if (emailPass) {
      const user = await this.loginWithPassword(emailPass)
      return { valid: !!user, user }
    } else if (phoneOTP) {
      const user = await this.loginWithOtp(phoneOTP)
      return { valid: !!user, user }
    }
    return { valid: false, user: null }
  }
}
