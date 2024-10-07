import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable, map } from 'rxjs';

export class PasswordInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: User) => {
        delete data['password'];
        return data;
      }),
    );
  }
}
