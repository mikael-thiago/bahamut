import { Operation, OperationProps } from '@entities/Operation';

import { OperationRepository } from '../repositories/OperationRepository';
import { UseCase } from '../shared/UseCase';

export type RegisterOperationUseCaseRequest = OperationProps;
export type RegisterOperationUseCaseResponse = Operation;

export abstract class RegisterOperationUseCase
  implements UseCase<RegisterOperationUseCaseRequest, RegisterOperationUseCaseResponse>
{
  abstract execute(request: OperationProps): Promise<Operation>;
}

export class RegisterOperationUseCaseImpl implements RegisterOperationUseCase {
  constructor(private _operationRepository: OperationRepository) {}

  async execute(request: RegisterOperationUseCaseRequest): Promise<Operation> {
    const { assetCode, date, quantity, type, valuePerAsset, userId } = request;

    const operation = new Operation({
      assetCode,
      date,
      quantity,
      type,
      valuePerAsset,
      userId,
    });

    await this._operationRepository.saveOperation(operation);

    return operation;
  }
}
