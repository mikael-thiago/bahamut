import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthenticatedUser } from './AuthenticatedUser';

export const User = createParamDecorator((_, ctx: ExecutionContext): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
