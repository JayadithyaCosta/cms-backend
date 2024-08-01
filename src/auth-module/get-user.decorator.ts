import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user-module/schemas/user.schema'; // Import your User schema

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
