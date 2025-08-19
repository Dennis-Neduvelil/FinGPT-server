import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

/**
 * Guard to protect routes with JWT authentication.
 * Extracts and verifies the JWT from the Authorization header.
 * Adds the decoded token payload to `request.user`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private config: ConfigService) {}
  /**
   * Determines whether the current request is allowed.
   * @param context The execution context of the request.
   * @returns boolean | Promise<boolean> | Observable<boolean>
   * @throws {UnauthorizedException} If authorization header is missing, malformed, or token is invalid.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      // Verify token and attach decoded payload to request
      const decoded = jwt.verify(token, this.config.get<string>('JWT_SECRET'));
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
