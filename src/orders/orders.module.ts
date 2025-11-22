import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { OrdersService } from './orders.service'
import { OrdersResolver } from './orders.resolver'
import { ProductsModule } from '../products/products.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [StorageModule, ProductsModule, PrismaModule],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
