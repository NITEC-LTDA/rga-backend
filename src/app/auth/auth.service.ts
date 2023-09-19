import { Injectable, UnauthorizedException } from '@nestjs/common'
import { TutorsService } from '../tutors/tutors.service'
import { createHash } from 'node:crypto'
import { JwtService } from '@nestjs/jwt'
import { jwtAdminConstants, jwtConstants } from './constants'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AdminsService } from '../admins/admins.service'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly tutorsService: TutorsService,
    private readonly adminsService: AdminsService,
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(cpf: string, pass: string): Promise<Tokens> {
    const tutor = await this.tutorsService.findByCpf(cpf)

    if (!tutor) {
      throw new UnauthorizedException('CPF não cadastrado ou inválido!')
    }
    const hashedPassword = this.hash(pass)

    if (tutor.password !== hashedPassword) {
      throw new UnauthorizedException('Senha/CPF inválidos!')
    }

    const [at, rt] = await this.createTokens(tutor.id)
    await this.updateRTHash(tutor.id, rt)

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  async signAdminIn(email: string, pass: string): Promise<Tokens> {
    const admin = await this.adminsService.findByEmail(email)

    if (!admin) {
      throw new UnauthorizedException('Email não cadastrado ou inválido!')
    }
    const hashedPassword = this.hash(pass)

    if (admin.password !== hashedPassword) {
      throw new UnauthorizedException('Senha/Email inválidos!')
    }

    const [at, rt] = await this.createAdminTokens(admin.id, admin.role)
    await this.updateRTHashAdmin(admin.id, rt)

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  async signOut(userId: string): Promise<boolean> {
    await this.prismaService.tutors.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
    return true
  }

  async signAdminOut(userId: string): Promise<boolean> {
    await this.prismaService.admins.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
    return true
  }

  async refreshTokens(tutorId: string, rt: string): Promise<Tokens> {
    const tutor = await this.prismaService.tutors.findUnique({
      where: {
        id: tutorId,
      },
    })

    if (!tutor || tutor.hashedRt !== this.hash(rt)) {
      throw new UnauthorizedException()
    }

    const [at, newRt] = await this.createTokens(tutor.id)
    await this.updateRTHash(tutor.id, newRt)

    return {
      accessToken: at,
      refreshToken: newRt,
    }
  }

  async refreshAdminTokens(adminId: string, rt: string): Promise<Tokens> {
    const admin = await this.prismaService.admins.findUnique({
      where: {
        id: adminId,
      },
    })

    if (!admin || admin.hashedRt !== this.hash(rt)) {
      throw new UnauthorizedException()
    }

    const [at, newRt] = await this.createAdminTokens(admin.id, admin.role)
    await this.updateRTHashAdmin(admin.id, newRt)

    return {
      accessToken: at,
      refreshToken: newRt,
    }
  }

  async updateRTHash(tutorId: string, refreshToken: string) {
    const hashedRt = this.hash(refreshToken)

    await this.prismaService.tutors.update({
      where: { id: tutorId },
      data: {
        hashedRt,
      },
    })
  }

  async updateRTHashAdmin(adminId: string, refreshToken: string) {
    const hashedRt = this.hash(refreshToken)

    await this.prismaService.admins.update({
      where: { id: adminId },
      data: {
        hashedRt,
      },
    })
  }

  private async createTokens(id: string): Promise<string[]> {
    const payload = {
      sub: id,
    }

    const at = this.jwtService.signAsync(payload, {
      secret: jwtConstants.atSecret,
      // TODO: change to 15m latter
      expiresIn: '15m',
    })

    const rt = this.jwtService.signAsync(payload, {
      secret: jwtConstants.rtSecret,
      expiresIn: '30d',
    })

    return await Promise.all([at, rt])
  }

  private async createAdminTokens(id: string, role: string): Promise<string[]> {
    const payload = {
      sub: id,
      role,
    }

    const at = this.jwtService.signAsync(payload, {
      secret: jwtAdminConstants.atSecret,
      // TODO: change to 15m latter
      expiresIn: '15m',
    })

    const rt = this.jwtService.signAsync(payload, {
      secret: jwtAdminConstants.rtSecret,
      expiresIn: '30d',
    })

    return await Promise.all([at, rt])
  }

  private hash(input: string): string {
    const crypto = createHash('sha256')
    return crypto.update(input).digest('hex')
  }
}
