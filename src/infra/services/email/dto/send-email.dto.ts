import { IsEmail, IsObject, IsString } from 'class-validator'

export class SendEmailDto {
  @IsString()
  @IsEmail()
  to: string

  @IsString()
  subject: string

  @IsObject()
  body: Record<string, any>
}
