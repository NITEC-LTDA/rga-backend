import { Module } from '@nestjs/common'
import { PetsService } from './pets.service'
import { PetsController } from './pets.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { S3StorageService } from '@/infra/cloud_storage/aws/s3.service'

@Module({
  imports: [DatabaseModule],
  controllers: [PetsController],
  providers: [PetsService, S3StorageService],
  exports: [PetsService],
})
export class PetsModule {}
