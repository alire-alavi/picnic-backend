import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { UsersController } from './users.controller'
import { RedisOptions } from '../configs/redis-config'

@Module({
  imports: [CacheModule.registerAsync(RedisOptions)],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule { }
