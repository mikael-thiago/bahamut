import { BalanceCalculatorService } from 'src/core/services/BalanceCalculatorService';
import { BalanceCalculatorServiceImpl } from './BalanceCalculatorService';
import CryptoService from 'src/core/services/CryptoService';
import { CryptoServiceImpl } from './CryptoService';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/core/services/TokenService';
import { TokenServiceImpl } from './TokenService';

const { TOKEN_SECRET } = process.env;

@Module({
  imports: [
    JwtModule.register({
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: `${60 * 60 * 24}s` },
    }),
  ],
  providers: [
    { provide: TokenService, useClass: TokenServiceImpl },
    { provide: CryptoService, useClass: CryptoServiceImpl },
    { provide: BalanceCalculatorService, useClass: BalanceCalculatorServiceImpl },
  ],
  exports: [TokenService, CryptoService, BalanceCalculatorService],
})
export class ServicesModule {}
