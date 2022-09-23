import { Body, CacheInterceptor, CacheKey, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ListInvestimentYearsUseCase, RegisterOperationUseCase } from '@usecases';
import { AuthenticatedUser, JwtGuard, User } from '../authentication';

@UseGuards(JwtGuard)
@Controller('operations')
export class OperationController {
  constructor(private _listYears: ListInvestimentYearsUseCase, private _registerOperation: RegisterOperationUseCase) {}

  @Get('/groupedByYear')
  listOperationsGroupedByYear(@User() user: AuthenticatedUser) {
    return this._listYears.execute({ userId: user.id });
  }

  @Post('/')
  registerOperation(@User() user: AuthenticatedUser, @Body() body) {
    const { date, ...rest } = body;
    const parsedDate = new Date(date);

    return this._registerOperation.execute({ userId: user.id, date: parsedDate, ...rest });
  }
}
