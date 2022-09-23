import CryptoService from '../services/CryptoService';
import { DomainError } from '../shared/DomainError';
import { TokenService } from '../services/TokenService';
import { UseCase } from '../shared/UseCase';
import { User } from '@entities/User';
import { UserRepository } from '../repositories/UserRepository';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export class LoginFailedError extends DomainError {
  constructor() {
    super('The given email or password are wrong or do not exists.');
  }
}

export type LoginErrors = LoginFailedError;

export abstract class LoginUseCase implements UseCase<LoginRequest, LoginResponse, LoginErrors> {
  abstract execute(request: LoginRequest): Promise<LoginResponse | LoginFailedError>;
}

export class LoginUseCaseImpl implements LoginUseCase {
  constructor(
    private _userRepository: UserRepository,
    private _tokenService: TokenService,
    private _cryptoService: CryptoService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse | LoginFailedError> {
    const { email, password } = request;
    const user = await this._userRepository.findByEmail(email);

    if (user) console.log({ ...user });

    const userExists = !!user;

    const isPasswordCorrect = user && this._cryptoService.verify(user.password, password);

    if (!userExists || !isPasswordCorrect) return new LoginFailedError();

    return {
      token: this._tokenService.encode({ email: user.email, id: user.id }),
    };
  }
}
