import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsFilter } from './dto/products.interface'
import { Product } from './models/product.model'

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        name: string
        slug: string
        price: number
        seo_title: string
        seo_description: string
        seo_keywords: string
        categoryId: string
        thumbnailId?: string
        channelId?: string
    }): Promise<Product> {
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                price: data.price,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                seo_keywords: data.seo_keywords,
                categoryId: data.categoryId,
                thumbnailId: data.thumbnailId,
                channelId: data.channelId,
            },
            include: {
                thumbnail: true,
                sliderImages: true,
                channel: true,
            },
        })

        return {
            ...product,
            price: product.price.toString(),
        } as Product
    }

    async list(
        filter?: ProductsFilter,
        limit?: number,
        offset?: number,
    ): Promise<Product[]> {
        const where: Prisma.ProductWhereInput = {}

        // Apply category filter
        if (filter?.category) {
            where.categoryId = filter.category
        }

        // Apply price filters
        if (filter?.priceLte !== undefined || filter?.priceGte !== undefined) {
            where.price = {}
            if (filter.priceLte !== undefined) {
                where.price.lte = filter.priceLte
            }
            if (filter.priceGte !== undefined) {
                where.price.gte = filter.priceGte
            }
        }

        const products = await this.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit || 20,
            skip: offset || 0,
            include: {
                thumbnail: true,
                sliderImages: true,
                channel: true,
            },
        })

        return products.map((p) => ({
            ...p,
            price: p.price.toString(),
        })) as Product[]
    }

    async getById(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                thumbnail: true,
                sliderImages: true,
                channel: true,
            },
        })
        if (!product) return null

        return {
            ...product,
            price: product.price.toString(),
        } as Product
    }

    async count(filter?: ProductsFilter): Promise<number> {
        const where: Prisma.ProductWhereInput = {}

        if (filter?.category) {
            where.categoryId = filter.category
        }

        if (filter?.priceLte !== undefined || filter?.priceGte !== undefined) {
            where.price = {}
            if (filter.priceLte !== undefined) {
                where.price.lte = filter.priceLte
            }
            if (filter.priceGte !== undefined) {
                where.price.gte = filter.priceGte
            }
        }

        return this.prisma.product.count({ where })
    }

    /**
     * Update product images: thumbnail and slider images.
     * - If thumbnailId is provided, set product.thumbnailId
     * - If sliderImageIds is provided, associate those images to the product
     *   and disassociate any existing images not in the new list.
     */
    async updateImages(
        productId: string,
        data: { thumbnailId?: string | null; sliderImageIds?: string[] | null },
    ): Promise<Product | null> {
        // Update thumbnail if provided
        if (data.thumbnailId !== undefined) {
            await this.prisma.product.update({
                where: { id: productId },
                data: { thumbnailId: data.thumbnailId || null },
            })
        }

        if (data.sliderImageIds !== undefined) {
            const newIds = data.sliderImageIds || []

            // Disassociate images that were linked to this product but are not in newIds
            await this.prisma.image.updateMany({
                where: {
                    productSliderId: productId,
                    id: { notIn: newIds.length ? newIds : ['-'] },
                },
                data: { productSliderId: null },
            })

            if (newIds.length) {
                // Associate specified images to this product
                await this.prisma.image.updateMany({
                    where: { id: { in: newIds } },
                    data: { productSliderId: productId },
                })
            }
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { thumbnail: true, sliderImages: true, channel: true },
        })
        if (!product) return null

        return { ...product, price: product.price.toString() } as Product
    }
}
