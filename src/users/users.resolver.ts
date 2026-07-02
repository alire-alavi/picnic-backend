import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRoleInput, UpdateUserInput, CreateUserInput, SetPasswordInput, UpdatePasswordInput } from './dto';
import { User } from './models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => User, {
        name: 'me',
        description: 'Get current authenticated user information'
    })
    @UseGuards(GqlAuthGuard)
    async me(@Context() context: any): Promise<User> {
        const userId = context.req.user.userId
        return this.usersService.findById(userId) as any
    }

    @Mutation(() => User, { name: 'createUser' })
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createUser(
        @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
    ): Promise<User> {
        // Additional validation layer if needed
        return this.usersService.create(input) as any
    }

    @Mutation(() => User, { name: 'updateUser' })
    @UseGuards(GqlAuthGuard)
    async updateUser(
        @Context() context: any,
        @Args('input', { type: () => UpdateUserInput }) input: UpdateUserInput,
    ): Promise<User> {
        const userId = context.req.user.userId
        return this.usersService.updateUser(userId, input) as any
    }

    @Mutation(() => User, {
        name: 'setPassword',
        description: 'Set a password for a user who does not have one yet'
    })
    async setPassword(
        @Context() context: any,
        @Args('input', { type: () => SetPasswordInput }) input: SetPasswordInput,
    ): Promise<User> {
        if (input.userId !== context.req.user.userId) {
            throw new Error('You are not allowed to perform this action')
        }
        return this.usersService.setPassword(input.userId, input.password) as any
    }

    @Mutation(() => User, {
        name: 'updatePassword',
        description: 'Update a user\'s password (requires old password verification)'
    })
    async updatePassword(
        @Context() context: any,
        @Args('input', { type: () => UpdatePasswordInput }) input: UpdatePasswordInput,
    ): Promise<User> {
        if (input.userId !== context.req.user.userId) {
            throw new Error('You are not allowed to perform this action')
        }
        return this.usersService.updatePassword(
            input.userId,
            input.oldPassword,
            input.newPassword,
        ) as any
    }

    @Mutation(() => User, {
        name: 'updateUserRole',
        description: 'Update a user\'s role (admin only)'
    })
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateUserRole(
        @Args('input', { type: () => UpdateUserRoleInput }) input: UpdateUserRoleInput,
    ): Promise<User> {
        return this.usersService.updateUserRole(input.userId, input.role) as any
    }
}
