import { IsNotEmpty, IsString } from 'class-validator';

export class UserKakaoDto {
  @IsString()
  @IsNotEmpty()
  kakaoId: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
