import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { CacheModule } from '@nestjs/cache-manager'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HealthModule } from './health/health.module'
import { ProductsModule } from './products/products.module'
import { PrismaModule } from './prisma/prisma.module'
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { SmsModule } from './sms/sms.module'
import { RedisOptions } from './configs/redis-config'
import { OrdersModule } from './orders/orders.module'
import { CategoriesModule } from './categories/categories.module'
import { ChannelsModule } from './channels/channels.module'
import { ImagesModule } from './images/images.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    CacheModule.registerAsync(RedisOptions),
    HealthModule,
    ProductsModule,
    PrismaModule,
    StorageModule,
    UsersModule,
    AuthModule,
    SmsModule,
    OrdersModule,
    CategoriesModule,
    ChannelsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
