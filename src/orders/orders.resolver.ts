import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { Order, OrderStatus } from './models/order.model'
import { GqlAuthGuard } from '../auth'
import { OrderStatus as PrismaOrderStatus } from '@prisma/client'
import { AddItemToCartInput } from './dto/add-to-cart.input'

@Resolver()
export class OrdersResolver {
  constructor(private readonly orderSerivce: OrdersService) { }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async orders(
    @Context() context: any,
    @Args('status', { type: () => OrderStatus, nullable: true })
    status?: PrismaOrderStatus,
  ): Promise<Order[]> {
    const userId = context.req.user.userId
    const response = await this.orderSerivce.findOrders(userId, status)
    return response as any
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async addItemToCart(
    @Context() context: any,
    @Args('input') input: AddItemToCartInput,
  ): Promise<Order> {
    const userId = context.req.user.userId
    const response = await this.orderSerivce.addItemToCart(
      userId,
      input.productId,
      input.quantity,
      input.channelId,
    )
    return response as any
  }
}
