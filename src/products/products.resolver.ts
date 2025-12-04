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
import { ProductsFilterInput } from './dto/products.input'
import { CreateProductInput } from './dto/create-product.input'
import { UpdateProductImagesInput } from './dto/update-product-images.input'
import { ProductsService } from './products.service'
import { Product } from './models/product.model'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard'
import { Roles, UserRole } from '../auth/decorators/roles.decorator'

@ObjectType()
class ProductsResponse {
  @Field(() => [Product])
  items: Product[]

  @Field(() => Int)
  total: number

  @Field(() => Int)
  limit: number

  @Field(() => Int)
  offset: number
}

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) { }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createProduct(
    @Args('input', { type: () => CreateProductInput })
    input: CreateProductInput
  ) {
    return this.productsService.create({
      name: input.name,
      slug: input.slug,
      price: input.price,
      seo_title: input.seo_title,
      seo_description: input.seo_description,
      seo_keywords: input.seo_keywords,
      categoryId: input.categoryId,
      thumbnailId: input.thumbnailId,
      channelId: input.channelId,
    })
  }

  @Query(() => ProductsResponse, { name: 'products' })
  async getProducts(
    @Args('productFilter', { type: () => ProductsFilterInput, nullable: true })
    filter?: ProductsFilterInput,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 })
    limit?: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset?: number,
  ): Promise<ProductsResponse> {
    const filterObj = filter
      ? {
        category: filter.category,
        priceLte: filter.priceLte,
        priceGte: filter.priceGte,
      }
      : {}

    const [items, total] = await Promise.all([
      this.productsService.list(filterObj, limit, offset),
      this.productsService.count(filterObj),
    ])

    return {
      items,
      total,
      limit: limit || 20,
      offset: offset || 0,
    }
  }

  @Query(() => Product, { name: 'product' })
  async getSingleProduct(@Args('id', { type: () => String }) id: string) {
    return this.productsService.getById(id)
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateProductImages(
    @Args('id', { type: () => String }) id: string,
    @Args('input', { type: () => UpdateProductImagesInput }) input: UpdateProductImagesInput,
  ) {
    return this.productsService.updateImages(id, {
      thumbnailId: input.thumbnailId,
      sliderImageIds: input.sliderImageIds,
    })
  }
}
