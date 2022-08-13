import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRecommendedTag } from './entities/user-recommended-tag.entity';
import { UserSecureTag } from './entities/user-secure-tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRecommendedTag)
    private userRecommendedTagRepository: Repository<UserRecommendedTag>,
    @InjectRepository(UserSecureTag)
    private userSecureTagRepository: Repository<UserSecureTag>,
  ) {}

  async updateTagsInfo(userDto: UpdateUserDto) {
    if (userDto.recommendedTags) {
      userDto.recommendedTags.map(async (tag) => {
        const t = new UserRecommendedTag();
        t.index = +tag;
        t.user = await this.userRepository.findOneBy({
          userId: userDto.userId,
        });
        await this.userRecommendedTagRepository.save(t);
      });
    }

    if (userDto.secureTags) {
      userDto.secureTags.map(async (tag) => {
        const t = new UserSecureTag();
        t.index = +tag;
        t.user = await this.userRepository.findOneBy({
          userId: userDto.userId,
        });
        await this.userSecureTagRepository.save(t);
      });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const isExist = await this.userRepository.findOneBy({
      userId: createUserDto.userId,
    });
    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered userId'],
        error: 'Forbidden',
      });
    }

    if (!(createUserDto.gender === 'F' || createUserDto.gender === 'M')) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['gender must be F or M'],
        error: 'Forbidden',
      });
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10); // FIX ME : use env

    const { password, ...result } = await this.userRepository.save(
      createUserDto,
    );

    await this.updateTagsInfo(createUserDto);
    return result;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const { name, nickname, password, birthDate, gender } = updateUserDto;
    const user = await this.userRepository.findOneBy({
      userId: updateUserDto.userId,
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Register user first'],
        error: 'NotFound',
      });
    }
    if (updateUserDto.userId !== undefined) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ["Can't update userID"],
        error: 'Forbidden',
      });
    }
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); // FIX ME : use env
    }

    await this.userRepository.update(userId, {
      name,
      nickname,
      password,
      birthDate,
      gender,
    });

    const recommendedTagsBefore = await this.userRecommendedTagRepository
      .createQueryBuilder('userRecommendedTag')
      .leftJoinAndSelect('userRecommendedTag.user', 'user')
      .where('user.userId = :userId', { userId: userId })
      .select('userRecommendedTag.id', 'id')
      .execute();

    const secureTagsBefore = await this.userSecureTagRepository
      .createQueryBuilder('userSecureTag')
      .leftJoinAndSelect('userSecureTag.user', 'user')
      .where('user.userId = :userId', { userId: userId })
      .select('userSecureTag.id', 'id')
      .execute();

    // delete previous tags
    if (recommendedTagsBefore.length > 0)
      await this.userRecommendedTagRepository.delete(recommendedTagsBefore);
    if (secureTagsBefore.length > 0)
      await this.userSecureTagRepository.delete(secureTagsBefore);

    await this.updateTagsInfo(updateUserDto);
  }

  async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
