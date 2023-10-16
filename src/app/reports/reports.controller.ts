import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { AdminOnlyGuard } from '@/commons/middlewares/admin-only.middleware'

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @UseGuards(AdminOnlyGuard)
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
    return this.reportsService.petsReport(filters, {
      page: parsedPage,
      limit: parsedLimit,
    })
  }

  @UseGuards(AdminOnlyGuard)
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
    return this.reportsService.tutorsReport(filters, {
      page: parsedPage,
      limit: parsedLimit,
    })
  }

  @UseGuards(AdminOnlyGuard)
  @Get('/new-tutors-per-month')
  @HttpCode(200)
  tutorsPerMonth(@Query('year') year: number) {
    const parsedYear = year ? Number(year) : new Date().getFullYear()
    return this.reportsService.newTutorsPerMonthReport(parsedYear)
  }
}
