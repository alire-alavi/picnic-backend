import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator'
import { ChannelType } from '@prisma/client'

@InputType()
export class UpdateChannelInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    slug?: string

    @Field(() => ChannelType, { nullable: true })
    @IsOptional()
    @IsEnum(ChannelType)
    type?: ChannelType

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
