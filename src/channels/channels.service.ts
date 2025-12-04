import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Channel } from './models/channel.model'
import { ChannelType } from '@prisma/client'

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string
    slug: string
    type: ChannelType
    description?: string
    isActive?: boolean
  }): Promise<Channel> {
    return this.prisma.channel.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    })
  }

  async findAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findActive(): Promise<Channel[]> {
    return this.prisma.channel.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
    })

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`)
    }

    return channel
  }

  async findBySlug(slug: string): Promise<Channel | null> {
    return this.prisma.channel.findUnique({
      where: { slug },
    })
  }

  async update(
    id: string,
    data: {
      name?: string
      slug?: string
      type?: ChannelType
      description?: string
      isActive?: boolean
    },
  ): Promise<Channel> {
    // Check if channel exists
    await this.findOne(id)

    return this.prisma.channel.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.type && { type: data.type }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
  }

  async remove(id: string): Promise<Channel> {
    // Check if channel exists
    await this.findOne(id)

    // Check if channel has products or orders
    const [productsCount, ordersCount] = await Promise.all([
      this.prisma.product.count({ where: { channelId: id } }),
      this.prisma.order.count({ where: { channelId: id } }),
    ])

    if (productsCount > 0 || ordersCount > 0) {
      throw new Error(
        `Cannot delete channel with ${productsCount} products and ${ordersCount} orders. Please reassign or delete them first.`,
      )
    }

    return this.prisma.channel.delete({
      where: { id },
    })
  }
}
