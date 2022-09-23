import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UseCase } from 'src/core/shared/UseCase';

export class CachedUseCaseProxy<Request = unknown, Response = unknown, Errors = unknown>
  implements UseCase<Request, Response, Errors>
{
  constructor(
    private _useCase: UseCase<Request, Response, Errors>,
    @Inject(CACHE_MANAGER) private _cache: Cache,
    private _getKey: (request: Request) => string,
  ) {}

  async execute(request: Request): Promise<unknown extends Errors ? Response : Response | Errors> {
    const key = this._getKey(request);

    let cachedResult = await this._cache.get<unknown extends Errors ? Response : Response | Errors>(key);

    if (!cachedResult) {
      cachedResult = await this._useCase.execute(request);
      this._cache.set(key, cachedResult);
      console.log(`Caching usecase result with key ${key}`);
    }

    return cachedResult;
  }
}
