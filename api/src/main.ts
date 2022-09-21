import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
