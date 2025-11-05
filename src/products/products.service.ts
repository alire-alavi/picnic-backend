import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async list(): Promise<Product[]> {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}
