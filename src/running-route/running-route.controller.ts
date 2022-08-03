import { Body, Controller, Post } from '@nestjs/common';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRouteService } from './running-route.service';

@Controller('running-route')
export class RunningRouteController {
  constructor(private readonly runningRouteService: RunningRouteService) {}

  @Post()
  create(@Body() createRunningRouteDto: CreateRunningRouteDto) {
    console.log(createRunningRouteDto);
    return this.runningRouteService.create(createRunningRouteDto);
  }
}
