import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase, SignUpUseCase } from '@usecases';

@Controller('auth')
export class AuthController {
  constructor(private _signUp: SignUpUseCase, private _login: LoginUseCase) {}

  @Post('sign-up')
  async signUp(@Body() body) {
    const { email, password, name } = body;

    return await this._signUp.execute({ email, password, name });
  }

  @Post('login')
  async signIn(@Body() body) {
    const { email, password } = body;

    return await this._login.execute({ email, password });
  }
}
