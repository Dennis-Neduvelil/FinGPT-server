import { Module } from '@nestjs/common';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { AuthRepository } from '../repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
