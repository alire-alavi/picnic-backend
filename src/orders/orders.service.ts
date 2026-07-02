import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OrderStatus, ShippingMethod, Prisma } from '@prisma/client'

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) { }

  async findOrders(userId?: string, status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {}

    if (userId) {
      where.userId = userId
    }

    if (status !== undefined) {
      where.orderStatus = status
    }

    const res = await this.prismaService.order.findMany({
      where,
      include: {
        user: true,
        channel: true,
        orderItems: {
          include: {
            item: {
              include: {
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return res
  }

  async findOne(id: string) {
    await this.prismaService.order.findUnique({
      where: { id },
      include: {
        channel: true,
      },
    })
  }

  async createOrder(userId: string, channelId?: string) {
    const qry = await this.prismaService.order.create({
      data: { userId, channelId },
      select: {
        id: true,
        userId: true,
        orderStatus: true,
        channelId: true,
      },
    })
    return qry
  }

  // TODO: impl guards for these queries
  async addItemToOrder(
    orderId: string,
    productId: string,
    price: number,
    quantity: number = 1,
  ) {
    const qryRes = this.prismaService.orderItem.create({
      data: { orderId, itemId: productId, quantity, price },
      select: {
        orderId: true,
        item: true,
        quantity: true,
        price: true,
      },
    })
    return qryRes
  }

  /**
   * Add an item to the current user's PENDING cart
   * Creates a new PENDING order if one doesn't exist
   */
  async addItemToCart(userId: string, productId: string, quantity: number, channelId?: string) {
    // First, get the product to retrieve its current price
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // Find or create a PENDING cart for this user
    let cart = await this.prismaService.order.findFirst({
      where: {
        userId,
        orderStatus: OrderStatus.PENDING,
      },
      include: {
        orderItems: true,
      },
    })

    // If no PENDING cart exists, create one
    if (!cart) {
      cart = await this.prismaService.order.create({
        data: {
          userId,
          orderStatus: OrderStatus.PENDING,
          channelId,
        },
        include: {
          orderItems: true,
        },
      })
    }

    // Check if this product is already in the cart
    const existingItem = cart.orderItems.find(
      (item) => item.itemId === productId,
    )

    if (existingItem) {
      // Update the quantity of the existing item
      await this.prismaService.orderItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      // Add new item to cart
      await this.prismaService.orderItem.create({
        data: {
          orderId: cart.id,
          itemId: productId,
          quantity,
          price: product.price,
        },
      })
    }

    // Return the updated cart with all items
    const updatedCart = await this.prismaService.order.findUnique({
      where: { id: cart.id },
      include: {
        user: true,
        channel: true,
        orderItems: {
          include: {
            item: true,
          },
        },
      },
    })

    return updatedCart
  }

  /**
   * Remove an item from the current user's PENDING cart
   */
  async removeItemFromCart(userId: string, productId: string) {
    // Find the user's PENDING cart
    const cart = await this.prismaService.order.findFirst({
      where: {
        userId,
        orderStatus: OrderStatus.PENDING,
      },
      include: {
        orderItems: true,
      },
    })

    if (!cart) {
      throw new Error('No active cart found')
    }

    // Find the item in the cart
    const existingItem = cart.orderItems.find(
      (item) => item.itemId === productId,
    )

    if (!existingItem) {
      throw new Error('Item not found in cart')
    }

    // Remove the item from the cart
    await this.prismaService.orderItem.delete({
      where: { id: existingItem.id },
    })

    // Return the updated cart with all items
    const updatedCart = await this.prismaService.order.findUnique({
      where: { id: cart.id },
      include: {
        user: true,
        channel: true,
        orderItems: {
          include: {
            item: true,
          },
        },
      },
    })

    return updatedCart
  }

  /**
   * Update order fields (status, channel, shipping method, etc.)
   */
  async updateOrder(
    userId: string,
    orderId: string,
    data: {
      orderStatus?: OrderStatus
      shippingMethod?: ShippingMethod
      channelId?: string
    },
  ) {
    // First verify the order belongs to the user
    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    })

    if (!order) {
      throw new Error('Order not found or does not belong to user')
    }

    // Update the order
    const updatedOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data,
      include: {
        user: true,
        channel: true,
        orderItems: {
          include: {
            item: {
              include: {
                thumbnail: true,
              },
            },
          },
        },
      },
    })

    return updatedOrder
  }
}
