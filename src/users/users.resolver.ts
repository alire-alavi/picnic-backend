import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
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
}
