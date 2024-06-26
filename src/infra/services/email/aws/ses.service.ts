import * as AWS_SES from '@aws-sdk/client-ses'

import { Injectable } from '@nestjs/common'
import { EmailService } from '../email.service'

const { SES } = AWS_SES

@Injectable()
export class SesService implements EmailService {
  private ses: AWS_SES.SES

  constructor() {
    this.ses = new SES({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      },
    })
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<AWS_SES.SendEmailCommandOutput> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            // TODO: Use a template engine to render the body
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.SOURCE_EMAIL,
    } as AWS_SES.SendEmailCommandInput

    return this.ses.sendEmail(params)
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    body: string,
    attachmentName: string,
    attachment: Buffer,
    attachmentMimeType: string,
  ): Promise<AWS_SES.SendEmailCommandOutput> {
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

    return this.ses.sendEmail(params)
  }
}
