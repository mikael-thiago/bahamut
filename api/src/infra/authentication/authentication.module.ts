import { JwtGuard } from './JwtGuard';
import { JwtStrategy } from './JwtPassportStrategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtGuard],
})
export class AuthenticationModule {}
