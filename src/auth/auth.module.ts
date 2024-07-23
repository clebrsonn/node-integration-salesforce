import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthConfigModule } from 'src/auth-config/auth-config.module';

@Module({
  imports: [
    UsersModule,
    AuthConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule, PassportModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      global: true,
      inject: [ConfigService],

      //signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
