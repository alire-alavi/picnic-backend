import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
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
            throw new ForbiddenException('User not authenticated')
        }

        if (!user.role) {
            throw new ForbiddenException('User role not found in token')
        }

        const hasRole = requiredRoles.some((role) => user.role === role)

        if (!hasRole) {
            throw new ForbiddenException(
                `User role '${user.role}' does not have permission. Required roles: ${requiredRoles.join(', ')}`
            )
        }

        return true
    }
}
