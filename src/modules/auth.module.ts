import { Module } from '@nestjs/common';
import { AuthController } from '../controllers';
import { AuthService, GoogleService } from '../services';
import { AuthRepository } from '../repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleService],
})
export class AuthModule {}
