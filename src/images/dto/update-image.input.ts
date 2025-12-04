import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsEnum } from 'class-validator'

@InputType()
export class UpdateImageInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  url?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  altText?: string
}
