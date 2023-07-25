import { Injectable } from '@nestjs/common'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'

@Injectable()
export class TutorAddressesService {
  create(createTutorAddressDto: CreateTutorAddressDto) {
    return 'This action adds a new tutorAddress'
  }

  findAll() {
    return `This action returns all tutorAddresses`
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorAddress`
  }

  update(id: number, updateTutorAddressDto: UpdateTutorAddressDto) {
    return `This action updates a #${id} tutorAddress`
  }

  remove(id: number) {
    return `This action removes a #${id} tutorAddress`
  }
}
