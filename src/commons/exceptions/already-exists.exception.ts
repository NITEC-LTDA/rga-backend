import { HttpException, HttpStatus } from '@nestjs/common'

export class AlreadyExistsException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.CONFLICT)
  }
}
