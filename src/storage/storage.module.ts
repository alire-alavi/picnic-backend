import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
import { StorageResolver } from './storage.resolver'

@Global()
@Module({
    imports: [ConfigModule],
    providers: [StorageService, StorageResolver],
    controllers: [StorageController],
    exports: [StorageService],
})
export class StorageModule { }
