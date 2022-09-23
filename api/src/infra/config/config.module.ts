import { AppConfig, CachedOperations, GetCacheKeys } from './AppConfig';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [NestConfigModule.forRoot()],
  providers: [
    {
      provide: AppConfig,
      useFactory: (configService: ConfigService): AppConfig => {
        const listInvestimentYearsCacheKey = configService.get<string>(
          'LIST_INVESTIMENT_YEARS_CACHE_KEY',
          'list-investiment-years',
        );

        const getCacheKeys: GetCacheKeys = {
          [CachedOperations.ListInvestimentYears]: ({ userId }) => `${userId}:${listInvestimentYearsCacheKey}`,
        };

        return {
          getCacheKeys,
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: [AppConfig],
})
export class ConfigModule {}
