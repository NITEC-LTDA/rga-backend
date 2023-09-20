export abstract class EmailService {
  abstract sendEmail(
    to: string,
    subject: string,
    body: Record<string, any>,
  ): Promise<any>

  abstract sendEmailWithAttachment(
    to: string,
    subject: string,
    body: string,
    attachmentName: string,
    attachment: Buffer,
    attachmentMimeType: string,
  ): Promise<any>
}
