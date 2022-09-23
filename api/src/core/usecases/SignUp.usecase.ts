import CryptoService from '../services/CryptoService';
import { DomainError } from '../shared/DomainError';
import { UseCase } from '../shared/UseCase';
import { User } from '@entities/User';
import { UserRepository } from '@repositories/UserRepository';

export interface SignUpUseCaseRequest {
  email: string;
  password: string;
  name?: string;
}

export type SignUpUseCaseResponse = Pick<User, 'email' | 'id' | 'name'>;

export class UserAlreadyExists extends DomainError {
  constructor(email: string) {
    super(`A user with email ${email} already exists!`);
  }
}

export abstract class SignUpUseCase implements UseCase<SignUpUseCaseRequest, SignUpUseCaseResponse, UserAlreadyExists> {
  abstract execute(request: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse | UserAlreadyExists>;
}

export class SignUpUseCaseImpl implements SignUpUseCase {
  constructor(private _userRepository: UserRepository, private _crypto: CryptoService) {}

  async execute({ email, password, name }: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse | UserAlreadyExists> {
    const existentUser = await this._userRepository.findByEmail(email);

    if (!!existentUser) return new UserAlreadyExists(email);

    const encodedPassword = await this._crypto.encode(password);

    const user = new User({ email, password: encodedPassword, name });

    await this._userRepository.saveUser(user);

    return {
      email,
      id: user.id,
      name,
    };
  }
}
