import { InputType, Field, registerEnumType } from '@nestjs/graphql'
import { IsOptional, IsUUID, IsEnum } from 'class-validator'
import {
    OrderStatus as PrismaOrderStatus,
    ShippingMethod as PrismaShippingMethod
} from '@prisma/client'

// Re-use the OrderStatus enum
const OrderStatus = PrismaOrderStatus

registerEnumType(OrderStatus, {
    name: 'UpdateOrderStatus',
})

// Re-use the ShippingMethod enum
const ShippingMethod = PrismaShippingMethod

registerEnumType(ShippingMethod, {
    name: 'UpdateShippingMethod',
})

@InputType()
export class UpdateOrderInput {
    @Field()
    @IsUUID()
    orderId: string

    @Field(() => OrderStatus, { nullable: true })
    @IsOptional()
    @IsEnum(PrismaOrderStatus)
    orderStatus?: PrismaOrderStatus

    @Field(() => ShippingMethod, { nullable: true })
    @IsOptional()
    @IsEnum(PrismaShippingMethod)
    shippingMethod?: PrismaShippingMethod

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID()
    channelId?: string
}
