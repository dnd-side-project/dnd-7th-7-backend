import { Module } from '@nestjs/common';
import { RunningRouteController } from './running-route.controller';
import { RunningRouteService } from './running-route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunningRoute } from './entities/running-route.entity';
import { RouteTag } from './entities/route-tag.entities';
import { NestjsFormDataModule, MemoryStoredFile } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([RunningRoute, RouteTag]),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [RunningRouteController],
  providers: [RunningRouteService],
})
export class RunningRouteModule {}
