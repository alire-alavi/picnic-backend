import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { SetPasswordInput } from './dto/set-password.input';
import { UpdatePasswordInput } from './dto/update-password.input';
import { User } from './models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

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
    async createUser(
        @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
    ): Promise<User> {
        // Additional validation layer if needed
        return this.usersService.create(input) as any
    }

    @Mutation(() => User, {
        name: 'setPassword',
        description: 'Set a password for a user who does not have one yet'
    })
    async setPassword(
        @Args('input', { type: () => SetPasswordInput }) input: SetPasswordInput,
    ): Promise<User> {
        return this.usersService.setPassword(input.userId, input.password) as any
    }

    @Mutation(() => User, {
        name: 'updatePassword',
        description: 'Update a user\'s password (requires old password verification)'
    })
    async updatePassword(
        @Args('input', { type: () => UpdatePasswordInput }) input: UpdatePasswordInput,
    ): Promise<User> {
        return this.usersService.updatePassword(
            input.userId,
            input.oldPassword,
            input.newPassword,
        ) as any
    }
}
