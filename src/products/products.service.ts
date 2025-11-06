import { Injectable } from '@nestjs/common'
import { Product } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsFilter } from './dto/products.interface'

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async list(filter?: ProductsFilter, limit?: number): Promise<Product[]> {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            where: filter ? { categoryId: filter.category } : {},
            take: limit || 20,
        })
    }

    async getById(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({ where: { id } })
    }
}
