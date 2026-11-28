import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address } from '@prisma/client';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

@Injectable()
export class AddressesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, input: CreateAddressInput): Promise<Address> {
        return this.prisma.address.create({
            data: {
                userId,
                street: input.street,
                type: input.type,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
                country: input.country,
            },
        });
    }

    async findAll(userId: string): Promise<Address[]> {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string): Promise<Address> {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });

        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found`);
        }

        // Ensure the address belongs to the requesting user
        if (address.userId !== userId) {
            throw new ForbiddenException('You do not have access to this address');
        }

        return address;
    }

    async update(id: string, userId: string, input: UpdateAddressInput): Promise<Address> {
        // First verify ownership
        await this.findOne(id, userId);

        return this.prisma.address.update({
            where: { id },
            data: {
                ...(input.street !== undefined && { street: input.street }),
                ...(input.type !== undefined && { type: input.type }),
                ...(input.city !== undefined && { city: input.city }),
                ...(input.state !== undefined && { state: input.state }),
                ...(input.zipCode !== undefined && { zipCode: input.zipCode }),
                ...(input.country !== undefined && { country: input.country }),
            },
        });
    }

    async remove(id: string, userId: string): Promise<Address> {
        // First verify ownership
        await this.findOne(id, userId);

        return this.prisma.address.delete({
            where: { id },
        });
    }
}
