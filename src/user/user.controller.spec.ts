import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RunningRoute } from '../running-route/entities/running-route.entity';
import { Bookmark } from './entities/bookmark.entity';
import { UserRecommendedTag } from './entities/user-recommended-tag.entity';
import { UserSecureTag } from './entities/user-secure-tag.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserRecommendedTag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserSecureTag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Bookmark),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RunningRoute),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
