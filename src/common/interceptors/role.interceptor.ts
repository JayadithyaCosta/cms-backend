import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('REQuest User::', user);

    // Extract role from _doc if not directly available on user object
    const userRole = user.role || (user._doc && user._doc.role);

    if (!user || !userRole || !roles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return next.handle();
  }
}
