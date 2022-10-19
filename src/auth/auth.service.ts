import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserKakaoDto } from '../user/dto/kakao-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOneBy({
      userId: loginUserDto.userId,
    });

    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Unregistered user'],
        error: 'Forbidden',
      });
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Wrong password'],
        error: 'Forbidden',
      });
    }
  }

  async login(
    user: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.getTokens(user.userId, user.nickname);
    await this.updateRtHash(user.userId, tokens.refresh_token);
    return tokens;
  }

  async logout(user: any) {
    await this.userRepository.update(
      { userId: user.userId },
      { currentHashedRefreshToken: null },
    );
  }

  async kakaoLogin(
    userKakaoDto: UserKakaoDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findOneBy({
      userId: userKakaoDto.kakaoId,
    });
    if (user) {
      const tokens = await this.getTokens(user.userId, user.nickname);
      await this.updateRtHash(user.userId, tokens.refresh_token);
      return tokens;
    }

    const existUserNum = await this.userRepository.count({});
    const newUser = {
      userId: String(userKakaoDto.kakaoId),
      nickname: '달리는다람쥐' + String(existUserNum + 1),
    };
    try {
      await this.userRepository.save(newUser);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Existing User');
      } else {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }

    const tokens = await this.getTokens(newUser.userId, newUser.nickname);
    await this.updateRtHash(user.userId, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: string, refresh_token: string) {
    const hash = await this.hashData(refresh_token);
    await this.userRepository.update(
      { userId },
      { currentHashedRefreshToken: hash },
    );
  }

  async refreshTokens(user: any) {
    const isExist = await this.userRepository.findOneBy({
      userId: user.userId,
    });

    if (!isExist || !isExist.currentHashedRefreshToken)
      throw new ForbiddenException('Invalid credentials');

    const rtMatches = bcrypt.compare(
      user.refresh_token,
      isExist.currentHashedRefreshToken,
    );

    if (!rtMatches) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.getTokens(user.userId, user.nickname);
    await this.updateRtHash(user.userId, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, nickname: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { userId: userId, nickname: nickname },
        {
          expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        { userId: userId, nickname: nickname },
        {
          expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
