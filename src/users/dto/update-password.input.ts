import { InputType, Field } from '@nestjs/graphql'
import { IsString, MinLength, IsUUID } from 'class-validator'

@InputType()
export class UpdatePasswordInput {
    @Field()
    @IsUUID()
    userId: string

    @Field()
    @IsString()
    @MinLength(8, { message: 'Old password must be at least 8 characters long' })
    oldPassword: string

    @Field()
    @IsString()
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    newPassword: string
}
