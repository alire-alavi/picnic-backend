import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(input: CreateUserInput) {
    const hasEmail = !!input.email
    const hasPhone = !!input.phoneNumber

    // Enforce XOR: either (email+password) or (phone) but not both/none
    if (!hasEmail && !hasPhone) {
      throw new BadRequestException(
        'Provide either email+password or phoneNumber',
      )
    }
    if (hasEmail && hasPhone) {
      throw new BadRequestException('Provide only one of email or phoneNumber')
    }
    if (hasEmail && !input.password) {
      throw new BadRequestException(
        'Password is required when email is provided',
      )
    }

    let passwordHash: string | undefined
    if (input.password) {
      passwordHash = this.hashPassword(input.password)
    }

    // If phone signup, skip email/password for now, OTP validation will be handled later
    const created = await this.prisma.user.create({
      data: {
        email: input.email ?? null,
        phoneNumber: input.phoneNumber ?? null,
        name: input.name ?? null,
        passwordHash: passwordHash ?? null,
      },
    })

    // For phone signups, you may later trigger OTP send here.
    return created
  }
}
