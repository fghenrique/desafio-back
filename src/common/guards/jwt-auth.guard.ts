import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info?.message === 'jwt expired')
      throw new ApiError('token-expired', 'Token expirado', 401);
    if (info?.message === 'No auth token') {
      throw new ApiError(
        'missing-token',
        'Você precisa se autenticar para utilizar este recurso',
        401,
      );
    }
    if (err || !user) {
      throw (
        err ||
        new ApiError('unauthorized', 'Não autorizado (jwt inválido)', 401)
      );
    }
    if (!user.email_validated)
      throw new ApiError(
        'unauthorized',
        'Email não validado, confira sua caixa de entrada e de spam',
        401,
      );
    return user;
  }
}
