import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StorageService } from './storage.service'
import { PrismaService } from '../prisma/prisma.service'
import { Image } from './models/image.model'
import { CreateImageInput } from './dto/create-image.input'
import { ulid } from 'ulid'

@Resolver(() => Image)
export class StorageResolver {
    constructor(
        private readonly storageService: StorageService,
        private readonly prisma: PrismaService,
    ) { }

    @Query(() => Image, { name: 'image' })
    async findOne(@Args('id') id: string) {
        return this.prisma.image.findUnique({
            where: { id },
        })
    }

    @Query(() => [Image], { name: 'images' })
    async findAll() {
        return this.prisma.image.findMany({
            orderBy: { createdAt: 'desc' },
        })
    }

    @Mutation(() => Image)
    async createImage(@Args('input') input: CreateImageInput) {
        // Await the file upload promise
        const upload = await input.file

        // Read the file stream into a buffer
        const chunks: Buffer[] = []
        for await (const chunk of upload.createReadStream()) {
            chunks.push(chunk)
        }
        const buffer = Buffer.concat(chunks)

        // Upload file to storage
        const key = ulid()
        const uploadResult = await this.storageService.uploadBuffer(
            key,
            buffer,
            upload.mimetype,
        )

        // Create image record in database
        return this.prisma.image.create({
            data: {
                id: key,
                url: uploadResult.url,
                size: input.size || 'LARGE',
                altText: input.altText,
            },
        })
    }

    @Mutation(() => Image)
    async deleteImage(@Args('id') id: string) {
        return this.prisma.image.delete({
            where: { id },
        })
    }
}
