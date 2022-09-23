import { AppConfig, CachedOperations } from '../config';
import { ListInvestimentYearsUseCaseImpl, RegisterOperationUseCaseImpl, UpdateOperationUseCaseImpl } from '@usecases';

import { Cache } from 'cache-manager';
import { CachedUseCaseProxy } from './proxies/CachedUseCaseProxy';
import { InvalidCacheUseCaseProxy } from './proxies/InvalidCacheUseCaseProxy';
import { OperationRepository } from '@repositories/OperationRepository';

export const registerOperationUseCaseFactory = ({
  operationRepository,
  cache,
  appConfig,
}: {
  operationRepository: OperationRepository;
  cache: Cache;
  appConfig: AppConfig;
}) => {
  const registerOperation = new RegisterOperationUseCaseImpl(operationRepository);

  return new InvalidCacheUseCaseProxy(registerOperation, cache, (request) => [
    appConfig.getCacheKeys[CachedOperations.ListInvestimentYears](request),
  ]);
};

export const updateOperationUseCaseFactory = ({
  operationRepository,
  cache,
  appConfig,
}: {
  operationRepository: OperationRepository;
  cache: Cache;
  appConfig: AppConfig;
}) => {
  const updateOperation = new UpdateOperationUseCaseImpl(operationRepository);

  return new InvalidCacheUseCaseProxy(updateOperation, cache, (request) => [
    appConfig.getCacheKeys[CachedOperations.ListInvestimentYears](request),
  ]);
};

export const listInvestimentYearsUseCaseFactory = ({
  operationRepository,
  cache,
  appConfig,
}: {
  operationRepository: OperationRepository;
  cache: Cache;
  appConfig: AppConfig;
}) => {
  const listInvestimentYears = new ListInvestimentYearsUseCaseImpl(operationRepository);

  return new CachedUseCaseProxy(
    listInvestimentYears,
    cache,
    appConfig.getCacheKeys[CachedOperations.ListInvestimentYears],
  );
};
