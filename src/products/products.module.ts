import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { ProductsResolver } from './products.resolver'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [StorageModule],
  providers: [ProductsService, ProductsResolver],
  controllers: [ProductsController],
})
export class ProductsModule { }
