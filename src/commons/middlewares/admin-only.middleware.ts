import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { JwtPayload } from '@/app/auth/types/jwtPayload.type'
import { verify } from 'jsonwebtoken'
import { AdminsService } from '@/app/admins/admins.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(
    private readonly adminService: AdminsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

    // Try to get admin details from cache
    const cachedAdmin = await this.cacheManager.get(adminId)

    let isAuthAdmin
    if (cachedAdmin) {
      isAuthAdmin = cachedAdmin
    } else {
      isAuthAdmin = await this.adminService.findById(adminId)

      // If admin found, store in cache
      if (isAuthAdmin) {
        await this.cacheManager.set(adminId, isAuthAdmin, 300) // cache for 5 minutes
      }
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
