import { Operation, OperationType } from '@entities/Operation';

import { Injectable } from '@nestjs/common';
import { Operation as OperationDbModel } from '@prisma/client';
import { OperationRepository } from '@repositories/OperationRepository';
import { PrismaService } from './PrismaService';

@Injectable()
export class PrismaOperationRepository implements OperationRepository {
  constructor(private _prismaService: PrismaService) {}

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
