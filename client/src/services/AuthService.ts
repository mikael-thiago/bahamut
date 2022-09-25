import { HttpAdapter, httpAdapter } from "../adapters/http/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export abstract class AuthService {
  abstract login(request: LoginRequest): Promise<{ token: string }>;
  abstract signUp(request: SignUpRequest): Promise<void>;
}

export class AuthServiceImpl implements AuthService {
  constructor(private _api: HttpAdapter) {}

  login(request: LoginRequest): Promise<{ token: string }> {
    return this._api.post("auth/login", request);
  }

  signUp(request: SignUpRequest): Promise<void> {
    return this._api.post("auth/sign-up", request);
  }
}

const authService: AuthService = new AuthServiceImpl(httpAdapter);

export const useAuthService = (): AuthService => ({
  login: authService.login.bind(authService),
  signUp: authService.signUp.bind(authService),
});
