import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) { }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(password, salt, 64)
    return `${salt}:${hash.toString('hex')}`
  }

  // For future: compare helper
  private verifyPassword(password: string, stored: string): boolean {
    const [salt, key] = stored.split(':')
    const hash = scryptSync(password, salt, 64)
    return timingSafeEqual(Buffer.from(key, 'hex'), hash)
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        orders: true,
        profile: true,
      },
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user
  }

  async create(input: CreateUserInput) {
    const hasEmail = !!input.email
    const hasPhone = !!input.phoneNumber

    // Enforce XOR: either email or phone but not both/none
    if (!hasEmail && !hasPhone) {
      throw new BadRequestException('Provide either email or phoneNumber')
    }
    if (hasEmail && hasPhone) {
      throw new BadRequestException('Provide only one of email or phoneNumber')
    }

    let passwordHash: string | undefined
    if (input.password) {
      passwordHash = this.hashPassword(input.password)
    }

    // Create user with or without password
    const created = await this.prisma.user.create({
      data: {
        email: input.email ?? null,
        phoneNumber: input.phoneNumber ?? null,
        name: input.name ?? null,
        passwordHash: passwordHash ?? null,
      },
    })

    return created
  }

  async getOrCreate(input: CreateUserInput): Promise<[any, boolean]> {
    const hasEmail = !!input.email
    const hasPhone = !!input.phoneNumber
    let created = false

    // Enforce XOR: either (email+password) or (phone) but not both/none
    if (!hasEmail && !hasPhone) {
      throw new BadRequestException(
        'Provide either email+password or phoneNumber',
      )
    }
    if (hasEmail && hasPhone) {
      throw new BadRequestException('Provide only one of email or phoneNumber')
    }

    // Try to find existing user
    let existingUser = null
    if (hasEmail) {
      existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      })
    } else if (hasPhone) {
      existingUser = await this.prisma.user.findFirst({
        where: { phoneNumber: input.phoneNumber },
      })
    }

    // If user exists, return them
    if (existingUser) {
      return [existingUser, created]
    }

    // Otherwise, create new user
    created = true
    return [await this.create(input), created]
  }

  /**
   * Creates a challenge token for user authentication initiation
   * Stores the token in Redis cache with a 5-minute TTL
   */
  async createChallengeToken(userId: string): Promise<string> {
    // Generate a secure random token (32 bytes = 64 hex characters)
    const challengeToken = randomBytes(32).toString('hex')

    // Store in cache with key pattern: user:challenge:{token}
    const cacheKey = `user:challenge:${challengeToken}`
    await this.cacheManager.set(cacheKey, userId, 300000) // 5 minutes TTL

    return challengeToken
  }

  /**
   * Verifies a challenge token and returns the associated user ID
   */
  async verifyChallengeToken(token: string): Promise<string | null> {
    const cacheKey = `user:challenge:${token}`
    const userId = await this.cacheManager.get<string>(cacheKey)
    return userId || null
  }

  /**
   * Sets a password for a user (only if they don't have one)
   * Used for initial password setup
   */
  async setPassword(userId: string, password: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Check if user already has a password
    if (user.passwordHash) {
      throw new BadRequestException(
        'User already has a password. Use updatePassword to change it.',
      )
    }

    // Hash and set the password
    const passwordHash = this.hashPassword(password)
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })

    return updated
  }

  /**
   * Updates a user's password (requires old password verification)
   */
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Check if user has a password
    if (!user.passwordHash) {
      throw new BadRequestException(
        'User does not have a password. Use setPassword instead.',
      )
    }

    // Verify old password
    const isValid = this.verifyPassword(oldPassword, user.passwordHash)
    if (!isValid) {
      throw new BadRequestException('Invalid old password')
    }

    // Hash and update the password
    const passwordHash = this.hashPassword(newPassword)
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })

    return updated
  }
}
