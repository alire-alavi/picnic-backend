import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
// import { CategoriesController } from './categories.controller'
import { CategoriesResolver } from './categories.resolver'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService, CategoriesResolver],
  // controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
