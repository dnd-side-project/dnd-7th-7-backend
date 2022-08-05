import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('create user', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test_id',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'F',
        address: 'test address',
      };

      usersRepository.save.mockResolvedValue(user);

      const res = await service.create(user);
      res.password = expect.anything();

      expect(res).toEqual(user);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('should fail if user exists', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test_id',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'F',
        address: 'test address',
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
        userId: 'test_id',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        address: 'test address',
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
        userId: 'test_id',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        address: 'test address',
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
        address: 'test address',
      };

      await expect(async () => {
        await service.update('test_id', body);
      }).rejects.toThrowError(new NotFoundException('Not Found Exception'));
    });

    it('update user id', async () => {
      const user = {
        name: 'test_name',
        nickname: 'test_nickname',
        userId: 'test_id',
        password: 'test1234',
        birthDate: moment().toDate(),
        gender: 'A',
        address: 'test address',
      };

      const body = {
        userId: 'new_user_id',
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
