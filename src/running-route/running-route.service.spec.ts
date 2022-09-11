import { Test, TestingModule } from '@nestjs/testing';
import { RunningRouteService } from './running-route.service';
import { Image } from './entities/image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RunningRoute } from './entities/running-route.entity';
import { RouteRecommendedTag } from './entities/route-recommended-tag.entity';
import { RouteSecureTag } from './entities/route-secure-tag.entity';
import { DataSource } from 'typeorm';
import { getRedisToken } from '@liaoliaots/nestjs-redis';

describe('RunningRouteService', () => {
  let service: RunningRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunningRouteService,
        { provide: getRedisToken('default'), useValue: {} },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(RunningRoute),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RouteRecommendedTag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RouteSecureTag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Image),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<RunningRouteService>(RunningRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
