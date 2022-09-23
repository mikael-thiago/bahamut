import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/core/services/TokenService';

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(private _jwtService: JwtService) {}

  encode(payload: string | object): string {
    return this._jwtService.sign(payload);
  }
}
