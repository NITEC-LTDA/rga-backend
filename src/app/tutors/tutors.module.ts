import { Global, Module } from '@nestjs/common'
import { TutorsService } from './tutors.service'
import { TutorsController } from './tutors.controller'
import { DatabaseModule } from '@/infra/database/database.module'

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
