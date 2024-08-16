import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthConfig } from 'src/auth-config/auth-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfig: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: authConfig.accessTokenConfig.secret,
    });
  }

  private static extractJWT(req: any): string | null {
    if (
      req.cookie &&
      'user_token' in req.cookie &&
      req.cookie.user_token.length > 0
    ) {
      console.log('token jwt', req.cookie.user_token);
      return req.cookie.user_token;
    }
    return null;
  }

  async validate(token: any): Promise<any> {
    const user = await this.authService.validateUser(token.username);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}

export interface JwtPayload {
  login: string;
}
