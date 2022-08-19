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

  async login(user: any) {
    const payload = { nickname: user.nickname, userId: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async kakaoLogin(
    userKakaoDto: UserKakaoDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({
      userId: userKakaoDto.kakaoId,
    });
    if (user) {
      const payload = {
        nickname: user.nickname,
        userId: user.userId,
      };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
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

    const payload = {
      nickname: newUser.nickname,
      userId: newUser.userId,
    };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
