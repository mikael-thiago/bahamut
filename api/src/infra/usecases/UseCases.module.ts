import { CACHE_MANAGER, Module } from '@nestjs/common';
import { LoginUseCase, LoginUseCaseImpl } from 'src/core/usecases/Login.usecase';
import { SignUpUseCase, SignUpUseCaseImpl } from 'src/core/usecases/SignUp.usecase';
import { UpdateOperationUseCase, UpdateOperationUseCaseImpl } from 'src/core/usecases/UpdateOperation.usecase';
import {
  listInvestimentYearsUseCaseFactory,
  registerOperationUseCaseFactory,
  updateOperationUseCaseFactory,
} from './factories';

import { AppConfig } from '../config';
import { Cache } from 'cache-manager';
import CryptoService from 'src/core/services/CryptoService';
import { ListInvestimentYearsUseCase } from 'src/core/usecases/ListInvestimentYears.usecase';
import { OperationRepository } from '@repositories/OperationRepository';
import { RegisterOperationUseCase } from 'src/core/usecases/RegisterOperation.usecase';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ServicesModule } from '../services/services.module';
import { TokenService } from 'src/core/services/TokenService';
import { UserRepository } from '@repositories/UserRepository';

@Module({
  imports: [RepositoriesModule, ServicesModule],
  providers: [
    {
      provide: RegisterOperationUseCase,
      useFactory: (operationRepository: OperationRepository, cache: Cache, appConfig: AppConfig) =>
        registerOperationUseCaseFactory({ operationRepository, cache, appConfig }),
      inject: [OperationRepository, CACHE_MANAGER, AppConfig],
    },
    {
      provide: UpdateOperationUseCase,
      useFactory: (operationRepository: OperationRepository, cache: Cache, appConfig: AppConfig) =>
        updateOperationUseCaseFactory({ operationRepository, cache, appConfig }),
      inject: [OperationRepository, CACHE_MANAGER, AppConfig],
    },
    {
      provide: ListInvestimentYearsUseCase,
      useFactory: (operationRepository: OperationRepository, cache: Cache, appConfig: AppConfig) =>
        listInvestimentYearsUseCaseFactory({ operationRepository, cache, appConfig }),
      inject: [OperationRepository, CACHE_MANAGER, AppConfig],
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepository: UserRepository, tokenService: TokenService, cryptoService: CryptoService) =>
        new LoginUseCaseImpl(userRepository, tokenService, cryptoService),
      inject: [UserRepository, TokenService, CryptoService],
    },
    {
      provide: SignUpUseCase,
      useFactory: (userRepository: UserRepository, cryptoService: CryptoService) =>
        new SignUpUseCaseImpl(userRepository, cryptoService),
      inject: [UserRepository, CryptoService],
    },
  ],
  exports: [RegisterOperationUseCase, UpdateOperationUseCase, ListInvestimentYearsUseCase, LoginUseCase, SignUpUseCase],
})
export class UseCasesModule {}
