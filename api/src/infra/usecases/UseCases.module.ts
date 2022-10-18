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
import { BalanceCalculatorService } from 'src/core/services/BalanceCalculatorService';
import { Cache } from 'cache-manager';
import CryptoService from 'src/core/services/CryptoService';
import { ListInvestmentYearsUseCase } from '@usecases/ListInvestmentYears.usecase';
import { OperationRepository } from '@repositories/OperationRepository';
import { RegisterOperationUseCase } from 'src/core/usecases/RegisterOperation.usecase';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ServicesModule } from '../services/services.module';
import { TokenService } from 'src/core/services/TokenService';
import { UserRepository } from '@repositories/UserRepository';
import {
  GetInvestmentYearDetailsUseCase,
  GetInvestmentYearDetailsUseCaseImpl,
} from '@usecases/GetInvestmentYearDetails.usecase';
import { ListYearOperationsUseCase, ListYearOperationsUseCaseImpl } from '@usecases/ListOperations.usecase';

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
      provide: ListYearOperationsUseCase,
      useFactory: (operationRepository: OperationRepository) => new ListYearOperationsUseCaseImpl(operationRepository),
      inject: [OperationRepository],
    },
    {
      provide: ListInvestmentYearsUseCase,
      useFactory: (
        operationRepository: OperationRepository,
        cache: Cache,
        appConfig: AppConfig,
        balanceCalculator: BalanceCalculatorService,
      ) => listInvestimentYearsUseCaseFactory({ operationRepository, cache, appConfig, balanceCalculator }),
      inject: [OperationRepository, CACHE_MANAGER, AppConfig, BalanceCalculatorService],
    },
    {
      provide: GetInvestmentYearDetailsUseCase,
      useFactory: (operationRepository: OperationRepository, balanceCalculator: BalanceCalculatorService) =>
        new GetInvestmentYearDetailsUseCaseImpl(operationRepository, balanceCalculator),
      inject: [OperationRepository, BalanceCalculatorService],
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
  exports: [
    RegisterOperationUseCase,
    ListYearOperationsUseCase,
    UpdateOperationUseCase,
    ListInvestmentYearsUseCase,
    GetInvestmentYearDetailsUseCase,
    LoginUseCase,
    SignUpUseCase,
  ],
})
export class UseCasesModule {}
