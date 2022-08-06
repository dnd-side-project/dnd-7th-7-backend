import { Test, TestingModule } from '@nestjs/testing';
import { RunningRouteController } from './running-route.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RunningRouteService } from './running-route.service';
import { RunningRoute } from './entities/running-route.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Image } from './entities/image.entities';
import { RouteTag } from './entities/route-tag.entities';
describe('RunningRouteController', () => {
  let controller: RunningRouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule],
      controllers: [RunningRouteController],
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

    controller = module.get<RunningRouteController>(RunningRouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
