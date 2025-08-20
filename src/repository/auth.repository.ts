import { Injectable } from '@nestjs/common';
import { GoogleAuthDto, SignInDto, SignUpDto } from '../dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: PrismaService) {}

  /**
   * Fetch a user by email for sign-in.
   * @param dto SignInDto containing email
   * @returns User object with id, email, and password or null if not found
   */
  async signIn(dto: SignInDto): Promise<{
    id: string;
    email: string;
    password: string;
    provider: string;
  } | null> {
    return this.db.user.findFirst({
      select: {
        id: true,
        email: true,
        password: true,
        provider: true,
      },
      where: { email: dto.email },
    });
  }

  /**
   * Create a new user for sign-up.
   * @param dto SignUpDto containing email, password, fullName
   * @returns Newly created user with selected fields
   */
  async signUp(
    dto: SignUpDto,
  ): Promise<{ id: string; email: string; createdAt: Date }> {
    return this.db.user.create({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      data: {
        ...dto,
        provider: 'LOCAL',
      },
    });
  }

  /**
   * Create or return a user for Google login/signup.
   * If a user with the given email exists, return it.
   * Otherwise, create a new one with provider = GOOGLE.
   *
   * @param dto Google user data (email, fullName, etc.)
   * @returns User object with selected fields
   */
  async googleAuth(dto: {
    email: string;
    fullName?: string;
  }): Promise<{ id: string; email: string; createdAt: Date }> {
    // Check if user already exists
    const existingUser = await this.db.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (existingUser) {
      return existingUser; // return existing user
    }

    // Create new user if not found
    return this.db.user.create({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      data: {
        email: dto.email,
        fullName: dto.fullName,
        provider: 'GOOGLE',
      },
    });
  }
}
