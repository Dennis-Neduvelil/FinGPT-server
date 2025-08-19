import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

/**
 * Regex for validating passwords:
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

/**
 * DTO for signing in a user
 */
export class SignInDto {
  /** User's email address */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** User's password */
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain upper, lower, number & symbol and be at least 6 characters',
  })
  password: string;
}

/**
 * DTO for signing up a new user
 */
export class SignUpDto {
  /** User's email address */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** User's password */
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain upper, lower, number & symbol and be at least 6 characters',
  })
  password: string;

  /** User's full name */
  @IsString()
  @IsNotEmpty()
  fullName: string;
}

/**
 * DTO for signing up a new user
 */
export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
