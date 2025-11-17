import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(
      {
        message,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        ...details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
