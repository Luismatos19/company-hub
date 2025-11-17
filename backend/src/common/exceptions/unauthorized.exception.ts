import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message = 'Não autorizado') {
    super(
      {
        message,
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

