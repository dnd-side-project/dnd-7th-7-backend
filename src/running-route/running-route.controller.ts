import { Body, Controller, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRouteService } from './running-route.service';

@Controller('running-route')
export class RunningRouteController {
  constructor(private readonly runningRouteService: RunningRouteService) {}

  @Post()
  @FormDataRequest()
  create(@Body() createRunningRouteDto: CreateRunningRouteDto) {
    return this.runningRouteService.create(createRunningRouteDto);
  }
}
