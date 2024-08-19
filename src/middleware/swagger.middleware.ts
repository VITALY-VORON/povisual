import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = basicAuth(req);

    if (!user || user.name !== 'sense' || user.pass !== 'HG@765J_VDJsavdbh&Hf78686_58dsKFJbSHfd6_75656sKJV#$FJf8dsBJ_fds%VFD') {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      throw new UnauthorizedException();
    }

    next();
  }
}
