import { OperationSortColumn } from '@repositories/OperationRepository';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { SortDirection } from 'src/core/shared/PagedResult';

export class ListYearOperationsQuery {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageSize?: number;

  @IsEnum(OperationSortColumn)
  @IsOptional()
  sortColumn?: OperationSortColumn;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}
