import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { PetsTransferRequestsService } from './pets_transfer_requests.service'
import { CreatePetsTransferRequestDto } from './dto/create-pets_transfer_request.dto'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { AlreadyCanceledException } from '@/commons/exceptions/already-canceled.exception'
import { AlreadyAcceptedException } from '@/commons/exceptions/already-accepted.exception'
import { PetsService } from '../pets/pets.service'
import { Pet } from '../pets/entities/pet.entity'
import { TutorsService } from '../tutors/tutors.service'

@Controller('pets-transfer-requests')
export class PetsTransferRequestsController {
  constructor(
    private readonly petsTransferRequestsService: PetsTransferRequestsService,
    private readonly petsService: PetsService,
    private readonly tutorsService: TutorsService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @GetCurrentUserId() currentUserId: string,
    @Body() createPetsTransferRequestDto: CreatePetsTransferRequestDto,
  ) {
    const receiver = await this.tutorsService.findByCpf(
      createPetsTransferRequestDto.receiverCPF,
    )

    if (!receiver) {
      throw new NotFoundException('Tutor não encontrado')
    }

    return this.petsTransferRequestsService.create(
      currentUserId,
      receiver.id,
      createPetsTransferRequestDto.petId,
    )
  }

  @Get('/sent')
  @HttpCode(200)
  findAllSent(@GetCurrentUserId() currentUserId: string) {
    return this.petsTransferRequestsService.findAllSent(currentUserId)
  }

  @Get('/received')
  @HttpCode(200)
  findAllReceived(@GetCurrentUserId() currentUserId: string) {
    return this.petsTransferRequestsService.findAllReceived(currentUserId)
  }

  @Patch(':requestId/accept')
  @HttpCode(200)
  async acceptRequest(@Param('requestId') requestId: string) {
    const isAcceptable =
      await this.petsTransferRequestsService.findOneAcceptable(requestId)

    if (!isAcceptable) {
      throw new AlreadyAcceptedException('Solicitação já aceita ou cancelada')
    }

    if (isAcceptable.senderId === isAcceptable.receiverId) {
      throw new NotFoundException('Solicitação não encontrada')
    }

    // Pet transfer logic
    const newTutorialId = isAcceptable.receiverId
    const pet = await this.petsService.findByTutorId(isAcceptable.senderId)
    const updatedPet = {
      ...pet,
      tutorId: newTutorialId,
    }
    await this.petsService.update(pet.rga, updatedPet)

    return this.petsTransferRequestsService.acceptRequest(requestId)
  }

  @Patch(':requestId/cancel')
  @HttpCode(200)
  async cancelRequest(@Param('requestId') requestId: string) {
    const isCancelable =
      await this.petsTransferRequestsService.findOneCancellable(requestId)

    if (!isCancelable) {
      throw new AlreadyCanceledException('Solicitação já cancelada ou aceita')
    }

    if (isCancelable.senderId === isCancelable.receiverId) {
      throw new NotFoundException('Solicitação não encontrada')
    }

    return this.petsTransferRequestsService.cancelRequest(requestId)
  }
}
