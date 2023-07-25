import { Module } from '@nestjs/common'
import { TutorAddressesService } from './tutor_addresses.service'
import { TutorAddressesController } from './tutor_addresses.controller'

@Module({
  controllers: [TutorAddressesController],
  providers: [TutorAddressesService],
  exports: [TutorAddressesService],
})
export class TutorAddressesModule {}
