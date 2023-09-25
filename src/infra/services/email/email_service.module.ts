import { Module } from '@nestjs/common'
import { SesService } from './aws/ses.service'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: SesService,
    },
  ],
  controllers: [EmailController],
  exports: [EmailService], // Export EmailService so it can be injected in other modules
})
export class EmailServiceModule {}
