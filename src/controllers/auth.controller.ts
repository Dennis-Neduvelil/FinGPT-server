import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../services';
import { SignInDto, SignUpDto } from '../dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ResponseBuilder } from '../utils/responseBuilder/responseBuilder.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly response: ResponseBuilder,
  ) {}

  /**
   * Sign in a user with email and password
   * @param {SignInDto} dto - Login credentials
   * @returns {Promise<object>} - Returns user ID and JWT token
   * @throws {HttpException} - Throws if credentials are invalid or internal error occurs
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    try {
      const data = await this.authService.signIn(dto);
      return this.response
        .status(HttpStatus.OK)
        .message('Login successful')
        .data(data)
        .build();
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new HttpException(
        this.response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .message(message)
          .build(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Sign up a new user
   * @param {SignUpDto} dto - User registration data
   * @returns {Promise<object>} - Returns created user info
   * @throws {ForbiddenException} - If user with email already exists
   * @throws {HttpException} - For any other internal error
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDto) {
    try {
      const data = await this.authService.signUp(dto);
      return this.response
        .status(HttpStatus.CREATED)
        .message('User created successfully')
        .data(data)
        .build();
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          this.response
            .status(HttpStatus.FORBIDDEN)
            .message('User with this email already exists')
            .build(),
        );
      }

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new HttpException(
        this.response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .message(message)
          .build(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}