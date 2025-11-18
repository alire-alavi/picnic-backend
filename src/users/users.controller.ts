import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserInput } from './dto/create-user.input'

interface GetOrCreateUserResponse {
    userId: string
    created: boolean
    challengeToken: string
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('initiate')
    @HttpCode(HttpStatus.OK)
    async getOrCreateUser(
        @Body() input: CreateUserInput,
    ): Promise<GetOrCreateUserResponse> {
        // Get or create the user
        const [user, created] = await this.usersService.getOrCreate(input)

        // Create a challenge session token
        const challengeToken = await this.usersService.createChallengeToken(user.id)

        return {
            userId: user.id,
            created,
            challengeToken,
        }
    }
}
