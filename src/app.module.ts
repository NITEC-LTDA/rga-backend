import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TutorAddressesModule } from './app/tutor_addresses/tutor_addresses.module'
import { TutorsModule } from './app/tutors/tutors.module'

@Module({
  imports: [ConfigModule.forRoot(), TutorsModule, TutorAddressesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
