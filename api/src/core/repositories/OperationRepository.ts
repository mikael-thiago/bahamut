import { Operation, OperationKeyType } from '@entities/Operation';

import { UserKeyType } from '@entities/User';

export abstract class OperationRepository {
  abstract saveOperation(operation: Operation): Promise<Operation>;
  abstract saveOperations(operations: Operation[]): Promise<Operation[]>;
  abstract getOperationById(operationId: OperationKeyType): Promise<Operation | null>;
  abstract getOperationsByYear(request: { userId: UserKeyType; year: number }): Promise<Operation[]>;
  abstract getOperations(request: { userId: UserKeyType }): Promise<Operation[]>;
  abstract getOperationsGroupedByYear(request: { userId: UserKeyType }): Promise<Record<number, Operation[]>>;
}
