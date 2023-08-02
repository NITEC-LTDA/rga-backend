import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { jwtConstants } from '../constants'
import { JwtPayload } from '../types/jwtPayload.type'
import { JwtPayloadWithRt } from '../types/jwtPayloadWithRt.type'
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.rtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

    return {
      ...payload,
      refreshToken,
    }
  }
}
