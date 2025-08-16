import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules';
import { ResponseBuilderModule } from './utils/responseBuilder/responseBuilder.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './utils/jwt/jwt.module';

@Module({
  imports: [JwtModule,
    PrismaModule,
    AuthModule,
    ResponseBuilderModule,
    ConfigModule.forRoot({
      isGlobal: true
    })],
})
export class AppModule { }
