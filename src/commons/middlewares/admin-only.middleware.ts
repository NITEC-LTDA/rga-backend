import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import { verify } from 'jsonwebtoken'
import { AdminsService } from '@/app/admins/admins.service'

@Injectable()
export class AdminOnlyGuard implements CanActivate {
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

    req.user = {
      sub: isAuthAdmin.id,
      role: isAuthAdmin.role,
      exp: decodedToken.exp,
      iat: decodedToken.iat,
    }
    return true
  }
}
