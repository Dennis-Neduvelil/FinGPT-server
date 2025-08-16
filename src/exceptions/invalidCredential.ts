import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Exception thrown when user credentials are invalid during authentication.
 * Extends NestJS `HttpException` and sets HTTP status to 401 (Unauthorized).
 *
 * @example
 * throw new InvalidCredentialException();
 */
export class InvalidCredentialException extends HttpException {
  /**
   * Creates a new `InvalidCredentialException`.
   */
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}