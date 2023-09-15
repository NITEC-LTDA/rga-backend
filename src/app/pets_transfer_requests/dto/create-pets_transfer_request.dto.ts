import { IsString, IsNotEmpty } from 'class-validator'

export class CreatePetsTransferRequestDto {
  @IsString()
  @IsNotEmpty()
  receiverCPF: string

  @IsString()
  @IsNotEmpty()
  petId: string
}
