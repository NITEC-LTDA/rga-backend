import { HttpException, HttpStatus } from '@nestjs/common'

export class AlreadyAcceptedException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST)
  }
}
