import { InputType, Field } from '@nestjs/graphql'
import { IsString, MinLength, IsUUID } from 'class-validator'

@InputType()
export class SetPasswordInput {
    @Field()
    @IsUUID()
    userId: string

    @Field()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string
}
