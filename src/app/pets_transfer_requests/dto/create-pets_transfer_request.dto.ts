import { IsString, IsNotEmpty } from 'class-validator'

export class CreatePetsTransferRequestDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string

  @IsString()
  @IsNotEmpty()
  petId: string
}
