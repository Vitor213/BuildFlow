import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
imports: [
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.getOrThrow<string>("JWT_SECRET"),
      signOptions: {
        expiresIn: config.getOrThrow("JWT_EXPIRES_IN"),
      },
    }),
  }),
]
export class AuthModule {}
