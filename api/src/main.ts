import { AppModule } from './app.module';
import { ErrorMapperInterceptor } from './infra/interceptors/ErrorMapperInterceptor';
import { NestFactory } from '@nestjs/core';

const { PORT = 3000 } = process.env;

const crypto = require('crypto');

global.crypto = crypto;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ErrorMapperInterceptor());
  await app.listen(PORT);
}
bootstrap();
