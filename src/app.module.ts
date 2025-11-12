import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HealthModule } from './health/health.module'
import { ProductsModule } from './products/products.module'
import { PrismaModule } from './prisma/prisma.module'
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';

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
    HealthModule,
    ProductsModule,
    PrismaModule,
    StorageModule,
    UsersModule,
    AuthModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
