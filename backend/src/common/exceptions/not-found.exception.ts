import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} com ID ${id} não encontrado`
      : `${resource} não encontrado`;
    
    super(
      {
        message,
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

