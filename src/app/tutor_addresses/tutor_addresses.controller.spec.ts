import { Test, TestingModule } from '@nestjs/testing'
import { TutorAddressesController } from './tutor_addresses.controller'
import { TutorAddressesService } from './tutor_addresses.service'

describe('TutorAddressesController', () => {
  let controller: TutorAddressesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorAddressesController],
      providers: [TutorAddressesService],
    }).compile()

    controller = module.get<TutorAddressesController>(TutorAddressesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
