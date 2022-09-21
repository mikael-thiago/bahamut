import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
