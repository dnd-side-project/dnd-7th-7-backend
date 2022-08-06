import { Test, TestingModule } from '@nestjs/testing';
import { RunningRouteService } from './running-route.service';
import { RouteTag } from './entities/route-tag.entities';
import { Image } from './entities/image.entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RunningRoute } from './entities/running-route.entity';

describe('RunningRouteService', () => {
  let service: RunningRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunningRouteService,
        {
          provide: getRepositoryToken(RunningRoute),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RouteTag),
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
