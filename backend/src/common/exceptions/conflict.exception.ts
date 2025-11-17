import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        message,
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}
