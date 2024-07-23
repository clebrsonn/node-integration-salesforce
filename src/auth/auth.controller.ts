import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthExceptionFilter } from 'src/auth-exception/auth-exception.filter';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) res,
  ) {
    const token = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie('user_token', token.access_token);
    res.redirect('/');

    return token;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('user_token', '', { expires: new Date(Date.now()) });
    return {};
  }

}
