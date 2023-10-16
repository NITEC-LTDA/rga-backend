import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsController } from './admins.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheConfigModule } from '@/cache.module'

@Module({
  imports: [DatabaseModule, CacheConfigModule],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
