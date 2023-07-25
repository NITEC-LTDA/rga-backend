import { Test, TestingModule } from '@nestjs/testing'
import { TutorAddressesService } from './tutor_addresses.service'

describe('TutorAddressesService', () => {
  let service: TutorAddressesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorAddressesService],
    }).compile()

    service = module.get<TutorAddressesService>(TutorAddressesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
