import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                slug: createCategoryDto.slug,
                imageId: createCategoryDto.imageId,
            },
            include: {
                image: true,
            },
        })
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                image: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                image: true,
                products: {
                    include: {
                        thumbnail: true,
                    },
                },
            },
        })

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`)
        }

        return category
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        // Check if category exists
        await this.findOne(id)

        return this.prisma.category.update({
            where: { id },
            data: {
                ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
                ...(updateCategoryDto.slug && { slug: updateCategoryDto.slug }),
                ...(updateCategoryDto.imageId !== undefined && { imageId: updateCategoryDto.imageId }),
            },
            include: {
                image: true,
            },
        })
    }

    async remove(id: string) {
        // Check if category exists
        await this.findOne(id)

        // Check if category has products
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        })

        if (productsCount > 0) {
            throw new Error(`Cannot delete category with ${productsCount} products. Please reassign or delete the products first.`)
        }

        return this.prisma.category.delete({
            where: { id },
        })
    }
}
