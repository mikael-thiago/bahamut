import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UseCase } from 'src/core/shared/UseCase';

export class InvalidCacheUseCaseProxy<Request = unknown, Response = unknown, Errors = unknown>
  implements UseCase<Request, Response, Errors>
{
  constructor(
    private _useCase: UseCase<Request, Response, Errors>,
    @Inject(CACHE_MANAGER) private _cache: Cache,
    private _getKeysToInvalidate: (request: Request) => string[],
  ) {}

  async execute(request: Request): Promise<unknown extends Errors ? Response : Response | Errors> {
    const response = await this._useCase.execute(request);

    const keysToInvalidate = this._getKeysToInvalidate(request);

    for (const key of keysToInvalidate) {
      await this._cache.del(key);
      console.log(`Invalidating cache for key ${key}`);
    }

    return response;
  }
}
