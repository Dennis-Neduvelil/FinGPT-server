import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto, GoogleAuthDto } from '../dto';
import * as argon2 from 'argon2';
import { AuthRepository } from '../repository';
import {
  EmailAssociatedWithSocialLoginException,
  InvalidCredentialException,
  UserNotFoundException,
} from '../exceptions';
import { JwtService } from '../utils/jwt/jwt.service';
import { AuthResult } from 'src/types';
import { GoogleService } from './google.service';
import { ConfigService } from '@nestjs/config';

interface IAuthService {
  signIn(dto: SignInDto): AuthResult;
  signUp(dto: SignUpDto): AuthResult;
  googleAuth(dto: GoogleAuthDto): AuthResult;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly googleService: GoogleService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Generates a signed JSON Web Token (JWT) for the given user.
   *
   * @private
   * @param {string} userId - The unique identifier of the user for whom the token is issued.
   * @returns {string} A signed JWT containing the userId as payload, valid for 30 days.
   */
  private signJwt(userId: string): string {
    return this.jwtService.signJwt(
      { userId },
      this.config.get<string>('JWT_TOKEN_AGE'),
    );
  }

  /**
   * Signs in a user with email and password.
   * @param dto SignInDto
   * @returns object containing userId and JWT token
   */
  async signIn(
    dto: SignInDto,
  ): Promise<{ userId: string; accessToken: string }> {
    const user = await this.authRepository.signIn(dto);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.provider !== 'LOCAL') {
      throw new EmailAssociatedWithSocialLoginException();
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialException();
    }

    const accessToken = this.signJwt(user.id);
    return { userId: user.id, accessToken };
  }

  /**
   * Registers a new user.
   * @param dto SignUpDto
   * @returns object containing new user's ID and email
   */
  async signUp(
    dto: SignUpDto,
  ): Promise<{ userId: string; accessToken: string }> {
    const hashedPassword = await argon2.hash(dto.password);
    const newUser = await this.authRepository.signUp({
      ...dto,
      password: hashedPassword,
    });
    const accessToken = this.signJwt(newUser.id);
    return { userId: newUser.id, accessToken };
  }

  /**
   * Login/SignUp Via Google.
   * @param dto GoogleAuthDto
   * @returns object containing new user's ID and email
   */
  async googleAuth(
    dto: GoogleAuthDto,
  ): Promise<{ userId: string; accessToken: string }> {
    const token = await this.googleService.getTokens(dto.code);
    const data = {
      fullName: token.user.given_name,
      email: token.user.email,
      googleId: token.user.id,
      profilePic: token.user.picture,
    };
    const newUser = await this.authRepository.googleAuth(data);
    const accessToken = this.signJwt(newUser.id);
    return { userId: newUser.id, accessToken };
  }
}
