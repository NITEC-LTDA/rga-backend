import { AdminsService } from '@/app/admins/admins.service'
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'

@Injectable()
export class AdminOnlyMiddleware implements NestMiddleware {
  constructor(private readonly adminService: AdminsService) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    const token = req?.headers.authorization?.replace('Bearer', '').trim()

    const isAuthAdmin = await this.adminService.validateToken(token)

    if (!isAuthAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    req.user = isAuthAdmin

    next()
  }
}
