import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthConfigModule } from 'src/auth-config/auth-config.module';
import { AuthConfig } from 'src/auth-config/auth-config';

@Module({
  imports: [
    UsersModule,
    AuthConfigModule,

    JwtModule.registerAsync({
      imports: [AuthConfigModule, PassportModule],
      useFactory: async (authConfig: AuthConfig) => ({
        secret: authConfig.accessTokenConfig.secret,
      }),
      global: true,
      inject: [AuthConfig],

      //signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
