import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Exception thrown when a user is not found in the database.
 * Extends NestJS `HttpException` and sets HTTP status to 404 (Not Found).
 *
 * @example
 * throw new UserNotFoundException();
 */
export class UserNotFoundException extends HttpException {
  /**
   * Creates a new `UserNotFoundException`.
   */
  constructor() {
    super('User not found with this email', HttpStatus.NOT_FOUND);
  }
}