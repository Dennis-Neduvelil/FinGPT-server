import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResponseBuilder } from '../utils/responseBuilder/responseBuilder.service';

/**
 * Global exception filter for handling all uncaught exceptions in the application.
 *
 * Features:
 * - Handles Prisma `P2002` unique constraint violation (duplicate records).
 * - Handles standard NestJS `HttpException` and wraps its response.
 * - Provides a generic fallback for unexpected/unhandled errors.
 *
 * Responses are wrapped using the custom `ResponseBuilder` utility
 * for consistent API error responses.
 *
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Catches and processes exceptions thrown during request handling.
   *
   * @param exception - The thrown exception (can be HttpException, Prisma error, or generic Error)
   * @param host - The current request execution context
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle Prisma unique constraint error
    if (
      exception instanceof PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json(
          new ResponseBuilder()
            .status(HttpStatus.FORBIDDEN)
            .message('User with this email already exists')
            .build(),
        );
    }

    // Handle NestJS HttpException (wrap in ResponseBuilder)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      let message = 'Unexpected error';
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (
        typeof errorResponse === 'object' &&
        (errorResponse as any).message
      ) {
        message = (errorResponse as any).message;
      }

      return response
        .status(status)
        .json(new ResponseBuilder().status(status).message(message).build());
    }

    // Generic fallback for unknown/unexpected errors
    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseBuilder()
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .message(message)
          .build(),
      );
  }
}
