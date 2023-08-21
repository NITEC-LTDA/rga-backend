import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
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

  validate(req, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req?.headers.authorization
      ?.replace('Bearer', '')
      .trim()

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

    // Manually check token expiration
    const currentTimestamp = Math.floor(Date.now() / 1000) // current time in seconds since the UNIX epoch
    if (payload.exp && currentTimestamp > payload.exp) {
      throw new ForbiddenException('Refresh token has expired')
    }

    return {
      ...payload,
      refreshToken,
    }
  }
}
