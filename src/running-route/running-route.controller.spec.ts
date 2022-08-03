import { Test, TestingModule } from '@nestjs/testing';
import { RunningRouteController } from './running-route.controller';

describe('RunningRouteController', () => {
  let controller: RunningRouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunningRouteController],
    }).compile();

    controller = module.get<RunningRouteController>(RunningRouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
