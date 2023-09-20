import { Module } from '@nestjs/common'
import { SesService } from './aws/ses.service'
import { EmailService } from './email.service'

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: SesService,
    },
  ],
  exports: [EmailService], // Export EmailService so it can be injected in other modules
})
export class AppModule {}
