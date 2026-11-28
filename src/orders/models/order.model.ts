import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { User } from '../../users/models/user.model'
import { Product } from '../../products/models/product.model'
import { Channel } from '../../channels/models/channel.model'
import {
  OrderStatus as PrismaOrderStatus,
  ShippingMethod as PrismaShippingMethod
} from '@prisma/client'

// Re-export Prisma's OrderStatus enum for GraphQL
export const OrderStatus = PrismaOrderStatus

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
})

// Re-export Prisma's ShippingMethod enum for GraphQL
export const ShippingMethod = PrismaShippingMethod

registerEnumType(ShippingMethod, {
  name: 'ShippingMethod',
})

@ObjectType()
export class OrderItem extends AbstractModel {
  @Field(() => Product)
  item: Product

  @Field()
  quantity: number

  @Field()
  price: number
}

@ObjectType()
export class Order extends AbstractModel {
  @Field(() => User)
  user: User

  @Field(() => OrderStatus)
  orderStatus: typeof OrderStatus

  @Field(() => ShippingMethod, { nullable: true })
  shippingMethod?: typeof ShippingMethod

  @Field({ nullable: true })
  channelId?: string

  @Field(() => Channel, { nullable: true })
  channel?: Channel

  @Field(() => [OrderItem])
  orderItems: OrderItem[]

  @Field()
  updatedAt: string

  @Field()
  createdAt: string
}
