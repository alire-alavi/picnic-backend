import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsUUID } from 'class-validator'
import { UserRole } from '../models/user.model'

@InputType()
export class UpdateUserRoleInput {
    @Field()
    @IsUUID()
    userId: string

    @Field(() => UserRole)
    @IsEnum(UserRole)
    role: UserRole
}
