import { Operation, OperationKeyType } from '@entities/Operation';

import { UserKeyType } from '@entities/User';
import { PagedResult, SortDirection } from '../shared/PagedResult';

export enum OperationSortColumn {
  Date = 'date',
  AssetCode = 'assetCode',
  Quantity = 'quantity',
  Type = 'type',
}

export abstract class OperationRepository {
  abstract saveOperation(operation: Operation): Promise<Operation>;
  abstract saveOperations(operations: Operation[]): Promise<Operation[]>;
  abstract getOperationById(operationId: OperationKeyType): Promise<Operation | null>;
  abstract getOperationsByYear(request: { userId: UserKeyType; year: number }): Promise<Operation[]>;
  abstract getOperations(request: {
    userId: UserKeyType;
    year?: number;
    page?: number;
    pageSize?: number;
  }): Promise<Operation[]>;
  abstract getOperationsGroupedByYear(request: { userId: UserKeyType }): Promise<Record<number, Operation[]>>;
  abstract getOperationsPaged(request: {
    userId: UserKeyType;
    year: number;
    page: number;
    pageSize: number;
    sortColumn?: OperationSortColumn;
    sortDirection?: SortDirection;
  }): Promise<PagedResult<Operation>>;
}
