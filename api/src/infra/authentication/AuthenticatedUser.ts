import { UserKeyType } from '@entities/User';

export interface AuthenticatedUser {
  id: UserKeyType;
  email: string;
}
