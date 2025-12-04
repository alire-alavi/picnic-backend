import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CategoriesService } from './categories.service'
import { Category } from './models/category.model'
import { CreateCategoryInput } from './dto/create-category.input'
import { UpdateCategoryInput } from './dto/update-category.input'

@Resolver(() => Category)
export class CategoriesResolver {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Query(() => [Category], { name: 'categories' })
    async findAll() {
        return this.categoriesService.findAll()
    }

    @Query(() => Category, { name: 'category' })
    async findOne(@Args('id') id: string) {
        return this.categoriesService.findOne(id)
    }

    @Mutation(() => Category)
    async createCategory(@Args('input') input: CreateCategoryInput) {
        return this.categoriesService.create({
            name: input.name,
            slug: input.slug,
            imageId: input.imageId,
        })
    }

    @Mutation(() => Category)
    async updateCategory(
        @Args('id') id: string,
        @Args('input') input: UpdateCategoryInput,
    ) {
        return this.categoriesService.update(id, {
            name: input.name,
            slug: input.slug,
            imageId: input.imageId,
        })
    }

    @Mutation(() => Category)
    async deleteCategory(@Args('id') id: string) {
        return this.categoriesService.remove(id)
    }
}
