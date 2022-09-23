import { User, UserKeyType } from '@entities/User';

export abstract class UserRepository {
  abstract saveUser(user: User): Promise<User>;
  abstract findById(userId: UserKeyType): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
