import {
    Mutation,
    Resolver,
    Query,
    Args,
    Int,
    ObjectType,
    Field,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ImagesService } from './images.service'
import { Image } from './models/image.model'
import { CreateImageInput } from './dto/create-image.input'
import { UpdateImageInput } from './dto/update-image.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard'
import { Roles, UserRole } from '../auth/decorators/roles.decorator'

@ObjectType()
class ImagesResponse {
    @Field(() => [Image])
    items: Image[]

    @Field(() => Int)
    total: number

    @Field(() => Int)
    limit: number

    @Field(() => Int)
    offset: number
}

// Helper function to map Prisma Image to GraphQL Image
function mapPrismaImageToGraphQL(prismaImage: any): Image {
    return {
        id: prismaImage.id,
        url: prismaImage.url,
        size: prismaImage.size,
        altText: prismaImage.altText,
        createdAt: prismaImage.createdAt,
        updatedAt: prismaImage.updatedAt,
    } as Image
}

@Resolver(() => Image)
export class ImagesResolver {
    constructor(private readonly imagesService: ImagesService) { }

    @Mutation(() => Image)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createImage(
        @Args('input', { type: () => CreateImageInput })
        input: CreateImageInput
    ) {
        const image = await this.imagesService.create({
            id: input.id,
            url: input.url,
            size: input.size,
            altText: input.altText,
        })
        return mapPrismaImageToGraphQL(image)
    }

    @Query(() => ImagesResponse, { name: 'images' })
    async getImages(
        @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
        limit?: number,
        @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
        offset?: number,
    ): Promise<ImagesResponse> {
        const [items, total] = await Promise.all([
            this.imagesService.list(limit, offset),
            this.imagesService.count(),
        ])

        return {
            items: items.map(mapPrismaImageToGraphQL),
            total,
            limit: limit || 20,
            offset: offset || 0,
        }
    }

    @Query(() => Image, { name: 'image', nullable: true })
    async getSingleImage(@Args('id', { type: () => String }) id: string) {
        const image = await this.imagesService.getById(id)
        return image ? mapPrismaImageToGraphQL(image) : null
    }

    @Mutation(() => Image)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateImage(
        @Args('id', { type: () => String }) id: string,
        @Args('input', { type: () => UpdateImageInput }) input: UpdateImageInput,
    ) {
        const image = await this.imagesService.update(id, {
            url: input.url,
            size: input.size,
            altText: input.altText,
        })
        return mapPrismaImageToGraphQL(image)
    }

    @Mutation(() => Image)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async deleteImage(@Args('id', { type: () => String }) id: string) {
        const image = await this.imagesService.delete(id)
        return mapPrismaImageToGraphQL(image)
    }
}
