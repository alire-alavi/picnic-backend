import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType } from '@nestjs/graphql'
import { OrderStatus } from './user.enums'

@ObjectType()
export class Order extends AbstractModel {
    @Field(() => OrderStatus)
    orderStatus: OrderStatus

    @Field(() => [OrderItem])
    orderItems: OrderItem[]

    @Field()
    createdAt: string

    @Field()
    updatedAt: string
}

@ObjectType()
export class OrderItem extends AbstractModel {
    @Field()
    quantity: number

    @Field()
    price: string
}
