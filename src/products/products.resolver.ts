import { Resolver, Query, Args } from '@nestjs/graphql'
import { ProductsFilterInput } from './dto/products.input'
import { ProductsService } from './products.service'
import { Product } from './models/product.model'

@Resolver()
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) { }

    @Query(() => [Product], { name: 'products' })
    async getProducts(@Args('productFilter') filter: ProductsFilterInput) {
        return this.productsService.list({ category: filter.category })
    }

    @Query(() => Product, { name: 'product' })
    async getSingleProduct(@Args('id', { type: () => String }) id: string) {
        return this.productsService.getById(id)
    }
}
