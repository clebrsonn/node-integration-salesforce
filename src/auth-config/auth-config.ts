import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  constructor(private configService: ConfigService) {}

  get accessTokenConfig(): any {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_LIFETIME'),
    };
  }

  get refreshTokenConfig(): any {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_LIFETIME'),
    };
  }
}
