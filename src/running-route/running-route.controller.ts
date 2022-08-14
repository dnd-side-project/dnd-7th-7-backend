import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { SearchQueryStringDto } from './dto/search-query-string.dto';
import { UpdateRunningRouteDto } from './dto/update-running-route.dto';
import { RunningRouteService } from './running-route.service';

@Controller('running-route')
export class RunningRouteController {
  constructor(private readonly runningRouteService: RunningRouteService) {}

  @Post()
  @FormDataRequest()
  async create(@Body() createRunningRouteDto: CreateRunningRouteDto) {
    return await this.runningRouteService.create(createRunningRouteDto);
  }

  @Get('/search')
  async search(@Query() searchQueryStringDto: SearchQueryStringDto) {
    return await this.runningRouteService.search(searchQueryStringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/checkRunningExperience/:id')
  async checkRunningExperience(@Param('id') id: number, @Req() req) {
    return await this.runningRouteService.checkRunningExperience(
      id,
      req.user.sub,
    );
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.runningRouteService.getById(id);
  }

  @Put('/:id')
  @FormDataRequest()
  async update(
    @Param('id') id: number,
    @Body() updateRunningRouteDto: UpdateRunningRouteDto,
  ) {
    return await this.runningRouteService.update(id, updateRunningRouteDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.runningRouteService.delete(id);
  }
}
