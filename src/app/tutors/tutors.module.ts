import { Global, Module } from '@nestjs/common'
import { TutorsService } from './tutors.service'
import { TutorsController } from './tutors.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { EmailServiceModule } from '@/infra/services/email/email_service.module'

@Global()
@Module({
  imports: [DatabaseModule, EmailServiceModule],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
