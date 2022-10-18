import { Operation } from '@entities/Operation';
import { UserKeyType } from '@entities/User';
import { OperationRepository, OperationSortColumn } from '@repositories/OperationRepository';
import { PagedResult, SortDirection } from '../shared/PagedResult';

export interface ListOperationsUseCaseRequest {
  userId: UserKeyType;
  year: number;
  page?: number;
  pageSize?: number;
  sortColumn?: OperationSortColumn;
  sortDirection?: SortDirection;
}

export type ListOperationsUseCaseResponse = PagedResult<Operation>;

export abstract class ListYearOperationsUseCase {
  abstract execute(request: ListOperationsUseCaseRequest): Promise<ListOperationsUseCaseResponse>;
}

export class ListYearOperationsUseCaseImpl implements ListYearOperationsUseCase {
  constructor(private _operationsRepository: OperationRepository) {}

  async execute({
    userId,
    page = 1,
    pageSize = 100,
    year,
    sortColumn,
    sortDirection,
  }: ListOperationsUseCaseRequest): Promise<ListOperationsUseCaseResponse> {
    const operations = await this._operationsRepository.getOperationsPaged({
      userId,
      page,
      pageSize,
      year,
      sortColumn,
      sortDirection,
    });

    return operations;
  }
}
