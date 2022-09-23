import { Injectable } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { User } from '@entities/User';
import { User as UserDbModel } from '@prisma/client';
import { UserRepository } from '@repositories/UserRepository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private _prismaService: PrismaService) {}

  async saveUser(user: User): Promise<User> {
    const dbModel = this._toDbModel(user);

    await this._prismaService.user.upsert({
      where: {
        id: user.id,
      },
      update: dbModel,
      create: dbModel,
    });

    return user;
  }

  findById(userId: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return this._toEntity(user);
  }

  private _toDbModel(user: User): UserDbModel {
    return {
      email: user.email,
      id: user.id,
      password: user.password,
      name: user.name ?? null,
    };
  }

  private _toEntity(user: UserDbModel): User {
    return new User(
      {
        email: user.email,
        password: user.password,
        name: user.name ?? undefined,
      },
      user.id,
    );
  }
}
