import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles, UserRole } from '../auth/decorators/roles.decorator'

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    /**
     * Public endpoint - Get all categories
     */
    @Get()
    findAll() {
        return this.categoriesService.findAll()
    }

    /**
     * Public endpoint - Get a single category by ID
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id)
    }

    /**
     * Admin only - Create a new category
     */
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto)
    }

    /**
     * Admin only - Update an existing category
     */
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto)
    }

    /**
     * Admin only - Delete a category
     */
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id)
    }
}
