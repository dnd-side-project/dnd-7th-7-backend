import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserKakaoDto } from 'src/user/dto/kakao-user.dto';
import { AuthService } from '../auth.service';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.KAKAO_REDIRECT,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const payload: UserKakaoDto = {
      kakaoId: profileJson.id,
      accessToken,
    };
    done(null, payload);
  }
}
