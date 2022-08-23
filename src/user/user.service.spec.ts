import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { RunningRoute } from '../running-route/entities/running-route.entity';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { UserRecommendedTag } from './entities/user-recommended-tag.entity';
import { UserSecureTag } from './entities/user-secure-tag.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;
  let userRecommendedTagsRepository: MockRepository<UserRecommendedTag>;
  let userSecureTagsRepository: MockRepository<UserSecureTag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserRecommendedTag),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserSecureTag),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Bookmark),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(RunningRoute),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
    userRecommendedTagsRepository = module.get(
      getRepositoryToken(UserRecommendedTag),
    );
    userSecureTagsRepository = module.get(getRepositoryToken(UserSecureTag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('create user', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test@test.com',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'F',
        city: '서울특별시',
        state: '성동구',
        recommendedTags: [1, 2, 4],
        secureTags: [1, 3, 5]
      };

      usersRepository.save.mockResolvedValue(user);
      userRecommendedTagsRepository.createQueryBuilder.mockResolvedValue(
        user['recommendedTags'],
      );
      userSecureTagsRepository.createQueryBuilder.mockResolvedValue(
        user['secureTags'],
      );

      const res = await service.create(user);
      res.password = expect.anything();

      expect(res).toEqual(user);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should fail if user exists', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test@test.com',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'F',
        city: '서울특별시',
        state: '성동구',
        recommendedTags: [1, 2, 4],
        secureTags: [1, 3, 5]
      };

      usersRepository.findOneBy.mockResolvedValue(user);
      await expect(async () => {
        await service.create(user);
      }).rejects.toThrowError(new ForbiddenException('Forbidden Exception'));
      expect(usersRepository.save).toBeCalledTimes(0);
    });

    it('should fail if gender is not F or M', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test@test.com',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        city: '서울특별시',
        state: '성동구',
        recommendedTags: [1, 2, 4],
        secureTags: [1, 3, 5]
      };

      await expect(async () => {
        await service.create(user);
      }).rejects.toThrowError(new ForbiddenException('Forbidden Exception'));
      expect(usersRepository.save).toBeCalledTimes(0);
    });

    it('update user', async () => {
      const before = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test@test.com',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        city: '서울특별시',
        state: '성동구',
        recommendedTags: [1, 2, 4],
        secureTags: [1, 3, 5]
      };

      const after = {
        address: 'new address',
        password: 'new_password',
      };
      usersRepository.findOneBy.mockResolvedValue(before);
      await service.update('test_id', after);
    });

    it('update non existed user', async () => {
      const body = {
        city: '서울특별시',
        state: '성동구',
      };

      await expect(async () => {
        await service.update('test_id', body);
      }).rejects.toThrowError(new NotFoundException('Not Found Exception'));
    });

    it('update user id', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test@test.com',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        city: '서울특별시',
        state: '성동구',
        recommendedTags: [1, 2, 4],
        secureTags: [1, 3, 5]
      };

      const body = {
        userId: 'test_new@test.com',
      };
      usersRepository.findOneBy.mockResolvedValue(user);
      await expect(async () => {
        await service.update('test_id', body);
      }).rejects.toThrowError(new ForbiddenException('Forbidden Exception'));
    });

    it('remove user', async () => {
      await service.remove('test_id');
    });
  });
});
