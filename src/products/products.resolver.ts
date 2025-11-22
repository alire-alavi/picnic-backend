import { Resolver, Query, Args, Int, ObjectType, Field } from '@nestjs/graphql'
import { ProductsFilterInput } from './dto/products.input'
import { ProductsService } from './products.service'
import { Product } from './models/product.model'

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
}
