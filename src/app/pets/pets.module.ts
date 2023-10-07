import { Module } from '@nestjs/common'
import { PetsService } from './pets.service'
import { PetsController } from './pets.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { S3StorageService } from '@/infra/services/storage/aws/s3.service'
import { TutorsService } from '../tutors/tutors.service'

@Module({
  imports: [DatabaseModule],
  controllers: [PetsController],
  providers: [PetsService, S3StorageService, TutorsService],
  exports: [PetsService],
})
export class PetsModule {}
