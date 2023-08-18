import { Controller, Get } from '@nestjs/common'
import { Public } from '@/commons/decorators/public.decorator'

@Controller('tutors')
export class AppController {
  @Public()
  @Get('/health-check')
  async healthCheck() {
    return 'ok'
  }
}
