import { AdminsService } from '@/app/admins/admins.service'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { decode } from 'jsonwebtoken'

@Injectable()
export class AdminOnlyMiddleware implements NestMiddleware {
  constructor(private readonly adminService: AdminsService) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    const token = req?.headers.authorization?.replace('Bearer', '').trim()

    if (!token) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    const decodedToken = decode(token) as JwtPayload

    const adminId = decodedToken?.sub as string

    const isAuthAdmin = await this.adminService.findById(adminId)

    if (!isAuthAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    req.user = isAuthAdmin

    next()
  }
}
