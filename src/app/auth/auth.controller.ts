import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { AuthService, Tokens } from './auth.service'
import { Public } from '../../commons/decorators/public.decorator'
import { GetCurrentUserId } from '../../commons/decorators/get-current-user-id.decorator'
import { GetCurrentUser } from '../../commons/decorators/get-current-user.decorator'
import { RtGuard } from '@/commons/guards/rt.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>): Promise<Tokens> {
    return this.authService.signIn(signInDto.cpf, signInDto.password)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  signOut(@GetCurrentUser('sub') userId: string) {
    return this.authService.signOut(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
