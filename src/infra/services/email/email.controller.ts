import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { EmailService } from './email.service'
import { SendEmailDto } from './dto/send-email.dto'
import { compileTemplate } from './templates'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  /**
   * Notification e-mail for changing password recommendation
   * @param {SendEmailDto} sendEmailDto - DTO with the email data
   * @returns {Promise<void>} - Promise with the email data
   */
  @Post('/change-password/recommendation')
  @HttpCode(201)
  async sendEmailChangePasswordRecommendation(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<void> {
    const { body } = sendEmailDto
    const emailTemplate = compileTemplate(
      'changePasswordRecommendationNotification',
      {
        name: body.name,
        password: body.password,
        appName: process.env.APP_NAME,
      },
    )
    return this.emailService.sendEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      emailTemplate,
    )
  }

  /**
   * Change password request e-mail
   * @param {SendEmailDto} sendEmailDto - DTO with the email data
   * @returns {Promise<void>} - Promise with the email data
   */
  @Post('/change-password')
  @HttpCode(201)
  async sendEmailChangePassword(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<void> {
    const { body } = sendEmailDto
    const emailTemplate = compileTemplate('changePasswordNotification', {
      name: body.name,
      link: 'http://localhost:3001/health-check',
      appName: process.env.APP_NAME,
    })
    return this.emailService.sendEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      emailTemplate,
    )
  }
}
