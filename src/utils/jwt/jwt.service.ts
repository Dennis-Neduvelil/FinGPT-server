import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private config: ConfigService) {}

  /**
   * Sign a JWT token with the given payload.
   *
   * @template T Type of the payload
   * @param payload The payload to encode in the JWT
   * @param expiresIn Expiration time (e.g., '1h', '7d')
   * @returns The signed JWT as a string
   * @throws InternalServerErrorException if JWT_SECRET is not configured
   */
  signJwt<T extends Record<string, any>>(payload: T, expiresIn: string): string {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is not defined in the configuration');
    }

    try {
      return jwt.sign({ data: payload }, secret, { expiresIn });
    } catch (err) {
      throw new InternalServerErrorException('Failed to sign JWT token');
    }
  }
}