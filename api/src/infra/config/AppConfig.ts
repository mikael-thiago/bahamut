export enum CachedOperations {
  ListInvestimentYears = 1,
}

export type GetCacheKeyFunction<T = any> = (request: T) => string;
export type GetCacheKeys = Record<CachedOperations, GetCacheKeyFunction>;

export abstract class AppConfig {
  abstract getCacheKeys: GetCacheKeys;
}
