import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsFilter } from './dto/products.interface'
import { Product } from './models/product.model'

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

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
}
