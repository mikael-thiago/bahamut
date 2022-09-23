import { Operation, OperationKeyType, OperationProps } from '@entities/Operation';

import { EntityNotFoundError } from '../shared/DomainError';
import { OperationRepository } from '../repositories/OperationRepository';
import { UseCase } from '../shared/UseCase';

export type UpdateOperationUseCaseRequest = { operationId: OperationKeyType } & Partial<OperationProps>;
export type UpdateOperationUseCaseResponse = Operation;

export class OperationNotFoundError extends EntityNotFoundError<OperationKeyType> {
  constructor(id: OperationKeyType) {
    super({ entityName: 'Operation', ids: [id] });
  }
}

export abstract class UpdateOperationUseCase
  implements UseCase<UpdateOperationUseCaseRequest, UpdateOperationUseCaseResponse, OperationNotFoundError>
{
  abstract execute(request: UpdateOperationUseCaseRequest): Promise<Operation | OperationNotFoundError>;
}

export class UpdateOperationUseCaseImpl implements UpdateOperationUseCase {
  constructor(private _operationRepository: OperationRepository) {}

  async execute(request: UpdateOperationUseCaseRequest): Promise<Operation | OperationNotFoundError> {
    const { operationId, assetCode, date, quantity, type, valuePerAsset } = request;

    const operation = await this._operationRepository.getOperationById(operationId);

    if (!operation) return new OperationNotFoundError(operationId);

    operation.update({ assetCode, date, quantity, type, valuePerAsset });

    await this._operationRepository.saveOperation(operation);

    return operation;
  }
}
