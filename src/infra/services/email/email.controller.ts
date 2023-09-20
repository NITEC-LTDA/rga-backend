import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { EmailService } from './email.service'
import { SendEmailDto } from './dto/send-email.dto'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(201)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.body,
    )
  }
}
