import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { DomainError, EntityNotFoundError } from 'src/core/shared/DomainError';
import { LoginFailedError, UserAlreadyExists } from '@usecases';
import { Observable, map } from 'rxjs';

import { Response } from 'express';

@Injectable()
export class ErrorMapperInterceptor implements NestInterceptor {
  private _errorMapper = new Map<string, HttpStatus>([
    [LoginFailedError.name, HttpStatus.UNAUTHORIZED],
    [UserAlreadyExists.name, HttpStatus.UNAUTHORIZED],
    [EntityNotFoundError.name, HttpStatus.NOT_FOUND],
  ]);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const httpArgs = context.switchToHttp();
    const response = httpArgs.getResponse<Response>();

    return next.handle().pipe(
      map((result) => {
        if (result instanceof DomainError) {
          const status = this._errorMapper.get(result.constructor.name) ?? HttpStatus.BAD_REQUEST;
          const error = { statusCode: status, message: result.message };

          response.status(status);

          return error;
        }

        return result;
      }),
    );
  }
}
