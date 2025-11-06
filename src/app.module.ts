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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
