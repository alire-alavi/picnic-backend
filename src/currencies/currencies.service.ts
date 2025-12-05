import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Currency } from './models/currency.model'

@Injectable()
export class CurrenciesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        code: string
        name: string
        symbol: string
        decimalPlaces?: number
        isActive?: boolean
    }): Promise<Currency> {
        const currency = await this.prisma.currency.create({
            data: {
                code: data.code,
                name: data.name,
                symbol: data.symbol,
                decimalPlaces: data.decimalPlaces ?? 2,
                isActive: data.isActive ?? true,
            },
        })

        return currency as Currency
    }

    async update(
        id: string,
        data: {
            name?: string
            symbol?: string
            decimalPlaces?: number
            isActive?: boolean
        },
    ): Promise<Currency | null> {
        const currency = await this.prisma.currency.update({
            where: { id },
            data,
        })

        return currency as Currency
    }

    async list(activeOnly = false): Promise<Currency[]> {
        const where = activeOnly ? { isActive: true } : {}

        const currencies = await this.prisma.currency.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return currencies as Currency[]
    }

    async getById(id: string): Promise<Currency | null> {
        const currency = await this.prisma.currency.findUnique({
            where: { id },
        })

        return currency as Currency | null
    }

    async getByCode(code: string): Promise<Currency | null> {
        const currency = await this.prisma.currency.findUnique({
            where: { code },
        })

        return currency as Currency | null
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.currency.delete({
                where: { id },
            })
            return true
        } catch {
            return false
        }
    }
}
