import { Controller, Get, HttpCode } from '@nestjs/common'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly dashboardsService: ReportsService) {}

  @Get('/count-entities')
  @HttpCode(200)
  countEntities() {
    return this.dashboardsService.countEntities()
  }
}
