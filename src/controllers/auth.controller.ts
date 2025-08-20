import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services';
import { GoogleAuthDto, SignInDto, SignUpDto } from '../dto';
import { ResponseBuilder } from '../utils/responseBuilder/responseBuilder.service';

/**
 * Controller for authentication-related routes
 * Handles user signup and signin with proper error handling
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign in a user with email and password
   * @param {SignInDto} dto - User login credentials
   * @returns {Promise<object>} Returns user ID and JWT token
   * @throws {HttpException} Throws if credentials are invalid or internal error occurs
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    const data = await this.authService.signIn(dto);
    return new ResponseBuilder()
      .status(HttpStatus.OK)
      .message('Login successful')
      .data(data)
      .build();
  }

  /**
   * Sign up a new user
   * @param {SignUpDto} dto - User registration data
   * @returns {Promise<object>} Returns newly created user's ID and email
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDto) {
    const data = await this.authService.signUp(dto);
    return new ResponseBuilder()
      .status(HttpStatus.CREATED)
      .message('User created successfully')
      .data(data)
      .build();
  }

  /**
   * Login/SignUp Via Google
   * @param {GoogleAuthDto} dto - Google auth code
   * @returns {Promise<object>} Returns  user's ID and accessToken
   * @throws {ForbiddenException} If user with email already exists
   * @throws {HttpException} For any other internal error
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleAuthDto) {
    const data = await this.authService.googleAuth(dto);
    return new ResponseBuilder()
      .status(HttpStatus.CREATED)
      .message('User created successfully')
      .data(data)
      .build();
  }
}
