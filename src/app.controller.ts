import { Controller, Get, Res } from '@nestjs/common'
import { Public } from '@/commons/decorators/public.decorator'
import { FastifyReply } from 'fastify'

@Controller()
export class AppController {
  @Public()
  @Get('/health-check')
  async healthCheck(@Res() res: FastifyReply) {
    return res.status(204).send()
  }
}
