import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '../exceptions';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
  details?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    this.logError(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const baseResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...baseResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Requisição inválida',
        error: 'Bad Request',
        details:
          typeof exceptionResponse === 'object'
            ? (exceptionResponse as any).details
            : undefined,
      };
    }

    if (exception instanceof UnauthorizedException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...baseResponse,
        statusCode: HttpStatus.UNAUTHORIZED,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Não autorizado',
        error: 'Unauthorized',
      };
    }

    if (exception instanceof ForbiddenException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...baseResponse,
        statusCode: HttpStatus.FORBIDDEN,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Acesso negado',
        error: 'Forbidden',
      };
    }

    if (exception instanceof NotFoundException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...baseResponse,
        statusCode: HttpStatus.NOT_FOUND,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Recurso não encontrado',
        error: 'Not Found',
      };
    }

    if (exception instanceof ConflictException) {
      const exceptionResponse = exception.getResponse();
      return {
        ...baseResponse,
        statusCode: HttpStatus.CONFLICT,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || 'Conflito',
        error: 'Conflict',
      };
    }

    if (
      exception instanceof Error &&
      exception.message.includes('Validation failed')
    ) {
      return {
        ...baseResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erro de validação',
        error: 'Bad Request',
      };
    }

    if (
      exception instanceof Error &&
      exception.name === 'PrismaClientKnownRequestError'
    ) {
      return this.handlePrismaError(exception, baseResponse);
    }

    if (exception instanceof Error) {
      return {
        ...baseResponse,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          process.env.NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : exception.message,
        error: 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && {
          details: {
            stack: exception.stack,
            name: exception.name,
          },
        }),
      };
    }

    return {
      ...baseResponse,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
      error: 'Internal Server Error',
    };
  }

  private handlePrismaError(
    exception: Error,
    baseResponse: Omit<ErrorResponse, 'statusCode' | 'message' | 'error'>,
  ): ErrorResponse {
    const prismaError = exception as any;

    if (prismaError.code === 'P2025') {
      return {
        ...baseResponse,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Registro não encontrado',
        error: 'Not Found',
      };
    }

    if (prismaError.code === 'P2002') {
      return {
        ...baseResponse,
        statusCode: HttpStatus.CONFLICT,
        message: 'Já existe um registro com esses dados',
        error: 'Conflict',
      };
    }

    if (prismaError.code === 'P2003') {
      return {
        ...baseResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Referência inválida',
        error: 'Bad Request',
      };
    }

    return {
      ...baseResponse,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro no banco de dados',
      error: 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && {
        details: {
          code: prismaError.code,
          meta: prismaError.meta,
        },
      }),
    };
  }

  private getErrorName(status: number): string {
    const statusNames: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    };

    return statusNames[status] || 'Error';
  }

  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const { method, url } = request;
    const { statusCode, message } = errorResponse;

    const logMessage = `${method} ${url} - ${statusCode} - ${message}`;

    if (statusCode >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
      );
    } else if (statusCode >= 400) {
      this.logger.warn(logMessage);
    } else {
      this.logger.debug(logMessage);
    }
  }
}
