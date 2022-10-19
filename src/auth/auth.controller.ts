import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/loacl-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { UserKakaoDto } from 'src/user/dto/kakao-user.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('/kakao')
  @HttpCode(200)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('/kakao/redirect')
  @HttpCode(200)
  async kakaoLoginCallback(
    @Req() req,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.kakaoLogin(req.user as UserKakaoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/kakao/profile')
  getKakaoProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  async getToken(@Req() req) {
    return await this.authService.refreshTokens(req.user);
  }
}
