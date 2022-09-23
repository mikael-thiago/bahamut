import { CacheModule, Module } from '@nestjs/common';

import { AuthController } from './infra/controllers/AuthController';
import { AuthenticationModule } from './infra/authentication/authentication.module';
import { ConfigModule } from './infra/config';
import { OperationController } from './infra/controllers/OperationController';
import { UseCasesModule } from './infra/usecases/UseCases.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({ isGlobal: true, ttl: 60 * 60 * 24 }),
    AuthenticationModule,
    UseCasesModule,
  ],
  controllers: [AuthController, OperationController],
})
export class AppModule {}
