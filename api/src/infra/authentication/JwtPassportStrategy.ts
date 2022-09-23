import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticatedUser } from './AuthenticatedUser';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

const { TOKEN_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: TOKEN_SECRET,
    });
  }

  validate(payload: any): AuthenticatedUser {
    return { id: payload.id, email: payload.email };
  }
}
