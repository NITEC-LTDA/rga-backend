import { SES } from 'aws-sdk'

import { Injectable } from '@nestjs/common'
import { EmailService } from '../email.service'

@Injectable()
export class SesService implements EmailService {
  private ses: SES

  constructor() {
    this.ses = new SES({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<SES.SendEmailResponse> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.SOURCE_EMAIL,
    }

    return this.ses.sendEmail(params).promise()
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    body: string,
    attachmentName: string,
    attachment: Buffer,
    attachmentMimeType: string,
  ): Promise<SES.SendEmailResponse> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.SOURCE_EMAIL,
      Attachments: [
        {
          Filename: attachmentName,
          Content: attachment,
          ContentType: attachmentMimeType,
        },
      ],
    }

    return this.ses.sendEmail(params).promise()
  }
}
