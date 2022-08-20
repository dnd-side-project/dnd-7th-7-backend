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
import { CityQueryStringDto } from './dto/city-query-string.dto';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { LocationQueryStringDto } from './dto/location-query-string.dto';
import { UpdateRunningRouteDto } from './dto/update-running-route.dto';
import { RunningRouteService } from './running-route.service';

@Controller('running-route')
export class RunningRouteController {
  constructor(private readonly runningRouteService: RunningRouteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @FormDataRequest()
  async create(
    @Body() createRunningRouteDto: CreateRunningRouteDto,
    @Req() req,
  ) {
    return await this.runningRouteService.create(
      createRunningRouteDto,
      req.user.userId,
    );
  }

  @Get('/searchLocation')
  async searchBasedOnLocation(
    @Query() searchQueryStringDto: LocationQueryStringDto,
  ) {
    return await this.runningRouteService.searchBasedOnLocation(
      searchQueryStringDto,
    );
  }

  @Get('/searchCity')
  async searchBasedOnCity(@Query() cityQueryStringDto: CityQueryStringDto) {
    return await this.runningRouteService.searchBasedOnCity(cityQueryStringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/allSubRoute')
  async getAllSubRoute(@Req() req) {
    return await this.runningRouteService.getAllSubRoute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/allMainRoute')
  async getAllMainRoute(@Req() req) {
    return await this.runningRouteService.getAllMainRoute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/checkRunningExperience/:id')
  async checkRunningExperience(@Param('id') id: number, @Req() req) {
    return await this.runningRouteService.checkRunningExperience(
      id,
      req.user.userId,
    );
  }

  @Get('/main/:id')
  async getMainRouteDetail(@Param('id') id: number) {
    return await this.runningRouteService.getMainRouteDetail(id);
  }

  @Get('/sub/:id')
  async getById(@Param('id') id: number) {
    return await this.runningRouteService.getById(id);
  }

  @Get('/checkRouteName')
  async checkRouteName(@Query('routeName') routeName: string) {
    return await this.runningRouteService.checkRouteName(routeName);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @FormDataRequest()
  async update(
    @Param('id') id: number,
    @Body() updateRunningRouteDto: UpdateRunningRouteDto,
    @Req() req,
  ) {
    return await this.runningRouteService.update(
      id,
      updateRunningRouteDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number, @Req() req) {
    return await this.runningRouteService.delete(id, req.user.userId);
  }
}
