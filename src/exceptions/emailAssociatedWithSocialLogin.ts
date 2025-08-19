import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when a user attempts to log in with email/password
 * but the email is already associated with a social login (e.g., Google, Apple).
 *
 * Extends NestJS `HttpException` and sets HTTP status to 400 (Bad Request).
 *
 * @example
 * throw new EmailAssociatedWithSocialLoginException();
 */
export class EmailAssociatedWithSocialLoginException extends HttpException {
  /**
   * Creates a new `EmailAssociatedWithSocialLoginException`.
   */
  constructor() {
    super(
      'This email is associated with a social login. \nPlease use the corresponding provider to sign in.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
