import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message = 'Acesso negado') {
    super(
      {
        message,
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

