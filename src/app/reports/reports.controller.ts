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
    // Pagination
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const parsedPage = page ? Number(page) : 1
    const parsedLimit = limit ? Number(limit) : 10

    const filters = { neighborhood, species, breed }
    return this.dashboardsService.petsReport(filters, {
      page: parsedPage,
      limit: parsedLimit,
    })
  }

  @Get('/tutors') // /reports/tutors
  @HttpCode(200)
  tutorsReports(
    // filters
    @Query('neighborhood') neighborhood: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('zipcode') zipcode: string,
    // Pagination
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const filters = { neighborhood, state, city, zipcode }
    const parsedPage = page ? Number(page) : 1
    const parsedLimit = limit ? Number(limit) : 10
    return this.dashboardsService.tutorsReport(filters, {
      page: parsedPage,
      limit: parsedLimit,
    })
  }
}
