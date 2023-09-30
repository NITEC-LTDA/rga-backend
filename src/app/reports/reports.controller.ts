import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly dashboardsService: ReportsService) {}

  @Get('/count-entities')
  @HttpCode(200)
  countEntities() {
    return this.dashboardsService.countEntities()
  }

  @Get('/pets') // /reports/pets
  @HttpCode(200)
  petsReports(
    // filters
    @Query('neighborhood') neighborhood: string,
    @Query('species') species: string,
    @Query('breed') breed: string,
  ) {
    const filters = { neighborhood, species, breed }
    return this.dashboardsService.petsReport(filters)
  }

  @Get('/tutors') // /reports/tutors
  @HttpCode(200)
  tutorsReports(
    // filters
    @Query('neighborhood') neighborhood: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('zipcode') zipcode: string,
  ) {
    const filters = { neighborhood, state, city, zipcode }
    return this.dashboardsService.tutorsReport(filters)
  }
}
