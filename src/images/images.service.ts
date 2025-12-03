import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Image, ImageSize } from '@prisma/client'
import { ImageSize as GraphQLImageSize } from './models/image.model'

@Injectable()
export class ImagesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        id?: string
        url: string
        size?: GraphQLImageSize
        altText?: string
    }): Promise<Image> {
        return this.prisma.image.create({
            data: {
                id: data.id,
                url: data.url,
                size: data.size as ImageSize || ImageSize.LARGE,
                altText: data.altText,
            },
        })
    }

    async list(
        limit?: number,
        offset?: number,
    ): Promise<Image[]> {
        return this.prisma.image.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit || 20,
            skip: offset || 0,
        })
    }

    async count(): Promise<number> {
        return this.prisma.image.count()
    }

    async getById(id: string): Promise<Image | null> {
        return this.prisma.image.findUnique({
            where: { id },
        })
    }

    async update(
        id: string,
        data: {
            url?: string
            size?: GraphQLImageSize
            altText?: string
        },
    ): Promise<Image> {
        return this.prisma.image.update({
            where: { id },
            data: {
                url: data.url,
                size: data.size as ImageSize,
                altText: data.altText,
            },
        })
    }

    async delete(id: string): Promise<Image> {
        return this.prisma.image.delete({
            where: { id },
        })
    }
}
