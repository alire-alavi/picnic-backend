import { InputType, Field } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsUUID } from 'class-validator'

@InputType()
export class ProductsFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  priceLte?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  priceGte?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  category?: string
}
