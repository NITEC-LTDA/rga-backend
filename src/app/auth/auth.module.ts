import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { TutorsModule } from '../tutors/tutors.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AtStrategy, RtStrategy } from './strategies'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdminsModule } from '../admins/admins.module'

@Module({
  imports: [DatabaseModule, TutorsModule, AdminsModule, JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
