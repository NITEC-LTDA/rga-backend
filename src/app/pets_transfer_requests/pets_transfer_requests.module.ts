import { Module } from '@nestjs/common'
import { PetsTransferRequestsService } from './pets_transfer_requests.service'
import { PetsTransferRequestsController } from './pets_transfer_requests.controller'

@Module({
  controllers: [PetsTransferRequestsController],
  providers: [PetsTransferRequestsService],
})
export class PetsTransferRequestsModule {}
