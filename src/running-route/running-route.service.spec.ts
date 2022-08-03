import { Test, TestingModule } from '@nestjs/testing';
import { RunningRouteService } from './running-route.service';

describe('RunningRouteService', () => {
  let service: RunningRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunningRouteService],
    }).compile();

    service = module.get<RunningRouteService>(RunningRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
