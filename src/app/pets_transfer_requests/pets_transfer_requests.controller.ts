import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { PetsTransferRequestsService } from './pets_transfer_requests.service'
import { CreatePetsTransferRequestDto } from './dto/create-pets_transfer_request.dto'
import { UpdatePetsTransferRequestDto } from './dto/update-pets_transfer_request.dto'

@Controller('pets-transfer-requests')
export class PetsTransferRequestsController {
  constructor(
    private readonly petsTransferRequestsService: PetsTransferRequestsService,
  ) {}

  @Post()
  create(@Body() createPetsTransferRequestDto: CreatePetsTransferRequestDto) {
    return this.petsTransferRequestsService.create(createPetsTransferRequestDto)
  }

  @Get()
  findAll() {
    return this.petsTransferRequestsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsTransferRequestsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePetsTransferRequestDto: UpdatePetsTransferRequestDto,
  ) {
    return this.petsTransferRequestsService.update(
      +id,
      updatePetsTransferRequestDto,
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsTransferRequestsService.remove(+id)
  }
}
