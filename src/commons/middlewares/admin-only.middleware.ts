import { AdminsService } from '@/app/admins/admins.service'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { decode, verify } from 'jsonwebtoken'

@Injectable()
export class AdminOnlyMiddleware implements NestMiddleware {
  constructor(private readonly adminService: AdminsService) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    // Handle OPTIONS request for CORS preflight
    // if (req.method === 'OPTIONS') {
    //   next()
    //   return
    // }

    // const token = req?.headers.authorization?.replace('Bearer', '').trim()

    // if (!token) {
    //   throw new UnauthorizedException(
    //     'Você não tem permissão para acessar este recurso',
    //   )
    // }

    // let decodedToken: JwtPayload
    // try {
    //   // Verify the token's signature
    //   decodedToken = verify(token, process.env.AT_SECRET) as JwtPayload
    // } catch (err) {
    //   throw new UnauthorizedException('Invalid token provided.')
    // }

    // const adminId = decodedToken?.sub as string

    // const isAuthAdmin = await this.adminService.findById(adminId)

    // if (!isAuthAdmin) {
    //   throw new UnauthorizedException(
    //     'Você não tem permissão para acessar este recurso',
    //   )
    // }

    // req.user = isAuthAdmin
    return
    next()
  }
}
