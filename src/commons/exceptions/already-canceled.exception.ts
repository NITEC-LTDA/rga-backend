import { HttpException, HttpStatus } from '@nestjs/common'

export class AlreadyCanceledException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST)
  }
}
