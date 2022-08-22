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
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { RunningRoute } from 'src/running-route/entities/running-route.entity';
import { DeleteBookmarkDto } from './dto/delete-bookmark.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRecommendedTag)
    private userRecommendedTagRepository: Repository<UserRecommendedTag>,
    @InjectRepository(UserSecureTag)
    private userSecureTagRepository: Repository<UserSecureTag>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(RunningRoute)
    private runningRouteRepository: Repository<RunningRoute>,
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

  async getBookmarks(userId: string) {
    const bookmarks = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.user', 'user')
      .where('user.userId = :userId', { userId: userId })
      .select('bookmark.runningRoute')
      .execute();

    return bookmarks;
  }

  async createBookmark(
    createBookmarkDto: CreateBookmarkDto,
    userId: string,
  ): Promise<any> {
    const user = await this.userRepository.findOneBy({
      userId: userId,
    });
    if (!user) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Wrong userId'],
        error: 'Forbidden',
      });
    }

    const runningRoute = await this.runningRouteRepository.findOne({
      where: { id: createBookmarkDto.runningRoute },
    });
    if (!runningRoute) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Wrong running route id'],
        error: 'Forbidden',
      });
    }

    const isExist = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .where('bookmark.user =:userId', { userId: userId })
      .andWhere('bookmark.runningRoute =:runningRoute', {
        runningRoute: createBookmarkDto.runningRoute,
      })
      .execute();

    if (isExist && isExist.length > 0) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered running route'],
        error: 'Forbidden',
      });
    }

    const bookmark = new Bookmark();
    bookmark.user = user;
    bookmark.runningRoute = runningRoute;
    const result = await this.bookmarkRepository.save(bookmark);
    return result.id;
  }

  async deleteBookmark(deleteBookmarkDto: DeleteBookmarkDto,userId: string){
    const isExist = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .where('bookmark.user =:userId', { userId: userId })
      .andWhere('bookmark.runningRoute =:runningRoute', {
        runningRoute: deleteBookmarkDto.runningRoute,
      })
      .execute();

    if (isExist && isExist.length === 0) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['No running route exist'],
        error: 'Forbidden',
      });
    }

    await this.bookmarkRepository.delete(isExist[0].bookmark_id);
  }

  async getUseRecommended(userId: string) {
    const useRecommended = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId: userId })
      .select('user.numberOfUse')
      .execute();

    return useRecommended;
  }

  async increaseUseRecommended(userId: string) {
    await this.userRepository.increment({ userId: userId }, 'numberOfUse', 1);
  }
}
