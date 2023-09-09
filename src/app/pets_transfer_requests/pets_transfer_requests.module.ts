import { Module } from '@nestjs/common'
import { PetsTransferRequestsService } from './pets_transfer_requests.service'
import { PetsTransferRequestsController } from './pets_transfer_requests.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { PetsService } from '../pets/pets.service'

@Module({
  imports: [DatabaseModule],
  controllers: [PetsTransferRequestsController],
  providers: [PetsTransferRequestsService, PetsService],
})
export class PetsTransferRequestsModule {}
