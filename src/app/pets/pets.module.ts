import { Module } from '@nestjs/common'
import { PetsService } from './pets.service'
import { PetsController } from './pets.controller'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
