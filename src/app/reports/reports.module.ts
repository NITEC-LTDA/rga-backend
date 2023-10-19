import { Module } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminsModule } from '../admins/admins.module'
import { CacheConfigModule } from '@/cache.module'

@Module({
  imports: [DatabaseModule, AdminsModule, CacheConfigModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
