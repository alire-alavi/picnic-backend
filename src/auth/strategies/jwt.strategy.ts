import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export type JwtPayload = {
    sub: string
    email?: string
    role?: string
    [key: string]: any
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET') || 'change_me_in_env',
        })
    }

    async validate(payload: JwtPayload) {
        // Attach whatever you want on request.user
        return { userId: payload.sub, email: payload.email, role: payload.role }
    }
}
