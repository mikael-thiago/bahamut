import {
  Body,
  CacheInterceptor,
  CacheKey,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OperationSortColumn } from '@repositories/OperationRepository';
import { ListInvestmentYearsUseCase, RegisterOperationUseCase } from '@usecases';
import { GetInvestmentYearDetailsUseCase } from '@usecases/GetInvestmentYearDetails.usecase';
import { ListYearOperationsUseCase } from '@usecases/ListOperations.usecase';
import { SortDirection } from 'src/core/shared/PagedResult';
import { AuthenticatedUser, JwtGuard, User } from '../authentication';
import { ListYearOperationsQuery } from './requests/ListYearOperations';

@UseGuards(JwtGuard)
@Controller('operations')
export class OperationController {
  constructor(
    private _listYears: ListInvestmentYearsUseCase,
    private _registerOperation: RegisterOperationUseCase,
    private _getInvestmentYearDetails: GetInvestmentYearDetailsUseCase,
    private _listOperations: ListYearOperationsUseCase,
  ) {}

  @Get('/groupedByYear')
  listOperationsGroupedByYear(@User() user: AuthenticatedUser) {
    return this._listYears.execute({ userId: user.id });
  }

  @Get('/:year')
  listYearOperations(
    @User() user: AuthenticatedUser,
    @Param('year', new ParseIntPipe()) year: number,
    @Query() { page, pageSize, sortColumn, sortDirection }: ListYearOperationsQuery,
  ) {
    return this._listOperations.execute({ userId: user.id, year, page, pageSize, sortDirection, sortColumn });
  }

  @Get('/:year/details')
  getInvestmentYearDetails(@User() user: AuthenticatedUser, @Param('year', new ParseIntPipe()) year: number) {
    return this._getInvestmentYearDetails.execute({ userId: user.id, year: +year });
  }

  @Post('/')
  registerOperation(@User() user: AuthenticatedUser, @Body() body) {
    const { date, ...rest } = body;
    const parsedDate = new Date(date);

    return this._registerOperation.execute({ userId: user.id, date: parsedDate, ...rest });
  }
}
