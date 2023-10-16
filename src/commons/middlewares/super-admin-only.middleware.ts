import { AdminsService } from '@/app/admins/admins.service'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { verify } from 'jsonwebtoken'

@Injectable()
export class SuperAdminOnlyMiddleware implements CanActivate {
  constructor(private readonly adminService: AdminsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    const token = req?.headers.authorization?.replace('Bearer', '').trim()

    if (!token) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    let decodedToken: JwtPayload
    try {
      // Verify the token's signature
      decodedToken = verify(token, process.env.AT_SECRET) as JwtPayload
    } catch (err) {
      throw new UnauthorizedException('Invalid token provided.')
    }

    const adminId = decodedToken?.sub as string

    const isAuthAdmin = await this.adminService.findById(adminId)

    if (!isAuthAdmin) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    if (isAuthAdmin.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }

    req.user = isAuthAdmin
    return true
  }
}
