import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthResolver } from './auth.resolver'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CacheModule } from '@nestjs/cache-manager'
import { RedisOptions } from '../configs/redis-config'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync(RedisOptions),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'change_me_in_env',
        signOptions: {
          expiresIn: (() => {
            const raw = config.get<string>('JWT_EXPIRES_IN')
            if (!raw) return 3600
            const asNum = Number(raw)
            return Number.isFinite(asNum) ? asNum : 3600
          })(),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthResolver, AuthService],
  exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule { }
