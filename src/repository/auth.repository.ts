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
   * Create a new user for sign-up.
   * @param dto SignUpDto containing email, password, fullName
   * @returns Newly created user with selected fields
   */
  async googleAuth(
    dto: any,
  ): Promise<{ id: string; email: string; createdAt: Date }> {
    return this.db.user.create({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      data: {
        ...dto,
        provider: 'GOOGLE',
      },
    });
  }
}
