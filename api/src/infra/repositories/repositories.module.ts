import { Module } from '@nestjs/common';
import { OperationRepository } from '@repositories/OperationRepository';
import { PrismaOperationRepository } from './PrismaOperationRepository';
import { PrismaService } from './PrismaService';
import { PrismaUserRepository } from './PrismaUserRepository';
import { UserRepository } from '@repositories/UserRepository';

@Module({
  providers: [
    PrismaService,
    { provide: OperationRepository, useClass: PrismaOperationRepository },
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [OperationRepository, UserRepository],
})
export class RepositoriesModule {}
