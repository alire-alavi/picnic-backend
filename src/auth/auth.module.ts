import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || 'change_me_in_env',
                signOptions: {
                    expiresIn:
                        (() => {
                            const raw = config.get<string>('JWT_EXPIRES_IN')
                            if (!raw) return 3600
                            const asNum = Number(raw)
                            return Number.isFinite(asNum) ? asNum : 3600
                        })(),
                },
            }),
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class AuthModule { }
