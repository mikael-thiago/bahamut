import { Operation, OperationType } from '@entities/Operation';

import { Injectable } from '@nestjs/common';
import { Operation as OperationDbModel } from '@prisma/client';
import { OperationRepository, OperationSortColumn } from '@repositories/OperationRepository';
import { PagedResult, SortDirection } from 'src/core/shared/PagedResult';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaOperationRepository implements OperationRepository {
  constructor(private _prismaService: PrismaService) {}

  async getOperationsPaged({
    userId,
    year,
    page,
    pageSize,
    sortColumn,
    sortDirection,
  }: {
    userId: string;
    year: number;
    page: number;
    pageSize: number;
    sortColumn?: OperationSortColumn;
    sortDirection?: SortDirection;
  }): Promise<PagedResult<Operation>> {
    const skip = (page - 1) * pageSize;

    const dbModels = await this._prismaService.operation.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      skip,
      take: pageSize,
      orderBy: {
        ...(sortColumn && sortDirection !== undefined && { [sortColumn]: sortDirection }),
      },
    });

    const count = await this._prismaService.operation.count();

    const totalPages = Math.ceil(count / pageSize);
    const nextPage = page >= totalPages ? null : +page + 1;
    const previousPage = page <= 1 ? null : page - 1;

    return {
      currentPage: page,
      items: dbModels.map(this._toEntity),
      total: count,
      nextPage,
      previousPage,
      totalPages,
    };
  }

  async saveOperation(operation: Operation): Promise<Operation> {
    const dbModel = this._toDbModel(operation);

    await this._prismaService.operation.upsert({
      where: {
        id: dbModel.id,
      },
      update: dbModel,
      create: dbModel,
    });

    return operation;
  }

  saveOperations(operations: Operation[]): Promise<Operation[]> {
    return Promise.all(operations.map((operation) => this.saveOperation(operation)));
  }

  async getOperationById(operationId: string): Promise<Operation | null> {
    const dbModel = await this._prismaService.operation.findUnique({
      where: {
        id: operationId,
      },
    });

    if (!dbModel) return null;

    return this._toEntity(dbModel);
  }

  getOperationsByYear(request: { userId: 'string'; year: number }): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

  getOperations(request: { userId: 'string' }): Promise<Operation[]> {
    throw new Error('Method not implemented.');
  }

  async getOperationsGroupedByYear({ userId }: { userId: 'string' }): Promise<Record<number, Operation[]>> {
    const years = (
      await this._prismaService.$queryRaw<
        { year: number }[]
      >`SELECT DISTINCT YEAR(date) as year from Operation WHERE userId = ${userId}`
    ).map(({ year }) => year);

    const operationsByYear: Record<number, Operation[]> = {};

    for (const year of years) {
      const yearOperations = await this._prismaService.operation.findMany({
        where: {
          userId,
          date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
      });

      operationsByYear[year] = yearOperations.map((operation) => this._toEntity(operation));
      // for (const operation of operationsByYear[year]) {
      //   console.log(operation.date);
      // }
    }

    return operationsByYear;
  }

  private _toDbModel(operation: Operation): OperationDbModel {
    return {
      id: operation.id,
      type: operation.isBuying ? 'BUYING' : 'SELLING',
      assetCode: operation.assetCode,
      quantity: operation.quantity,
      valuePerAsset: operation.valuePerAsset,
      date: operation.date,
      userId: operation.userId,
    };
  }

  private _toEntity(dbModel: OperationDbModel): Operation {
    return new Operation(
      { ...dbModel, type: dbModel.type === 'BUYING' ? OperationType.Buying : OperationType.Selling },
      dbModel.id,
    );
  }
}
