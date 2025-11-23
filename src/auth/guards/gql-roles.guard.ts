import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator'

@Injectable()
export class GqlRolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredRoles) {
            return true
        }

        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req
        const user = request.user

        if (!user) {
            return false
        }

        return requiredRoles.some((role) => user.role === role)
    }
}
