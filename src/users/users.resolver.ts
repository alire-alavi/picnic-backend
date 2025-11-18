import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { SetPasswordInput } from './dto/set-password.input';
import { UpdatePasswordInput } from './dto/update-password.input';
import { User } from './models/user.model';

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

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
