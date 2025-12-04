import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator'
import { ChannelType } from '@prisma/client'

@InputType()
export class CreateChannelInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string

    @Field()
    @IsString()
    @IsNotEmpty()
    slug: string

    @Field(() => ChannelType)
    @IsEnum(ChannelType)
    @IsNotEmpty()
    type: ChannelType

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string

    @Field({ nullable: true, defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
