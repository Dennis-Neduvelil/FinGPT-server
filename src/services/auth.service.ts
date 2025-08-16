import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dto';
import * as argon2 from 'argon2';
import { AuthRepository } from '../repository';
import { InvalidCredentialException, UserNotFoundException } from '../exceptions';
import { JwtService } from '../utils/jwt/jwt.service';

interface IAuthService {
  signIn(dto: SignInDto): Promise<{ userId: string; token: string }>;
  signUp(dto: SignUpDto): Promise<{ userId: string; email: string }>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService, // renamed for clarity
  ) {}

  /**
   * Signs in a user with email and password.
   * @param dto SignInDto
   * @returns object containing userId and JWT token
   */
  async signIn(dto: SignInDto): Promise<{ userId: string; token: string }> {
    const user = await this.authRepository.signIn(dto);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialException();
    }

    const token = this.jwtService.signJwt(
      { userId: user.id }, // wrap payload as object
      '30d', // consider using config or constants for expiry
    );

    return { userId: user.id, token };
  }

  /**
   * Registers a new user.
   * @param dto SignUpDto
   * @returns object containing new user's ID and email
   */
  async signUp(dto: SignUpDto): Promise<{ userId: string; email: string }> {
    const hashedPassword = await argon2.hash(dto.password);
    const newUser = await this.authRepository.signUp({
      ...dto,
      password: hashedPassword,
    });

    return { userId: newUser.id, email: newUser.email };
  }
}