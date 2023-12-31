import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err)
      throw (
        err ||
        new UnauthorizedException({
          success: false,
          message: 'Not authorized',
          data: null,
        })
      );
    if (!user)
      throw new UnauthorizedException({
        success: false,
        message: 'Not authorized',
        data: null,
      });

    return user;
  }
}
