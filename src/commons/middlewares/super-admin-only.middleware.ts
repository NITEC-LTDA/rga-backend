import { AdminsService } from '@/app/admins/admins.service'
import { AdminRole } from '@/app/admins/entities/admin.entity'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { decode } from 'jsonwebtoken'

@Injectable()
export class SuperAdminOnlyMiddleware implements CanActivate {
  constructor(private readonly adminService: AdminsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request?.headers.authorization?.replace('Bearer', '').trim()

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
    if (isAuthAdmin.role !== AdminRole.SUPER_ADMIN) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso',
      )
    }
    return true
  }
}
