import { Module } from '@nestjs/common';
import { RunningRouteController } from './running-route.controller';
import { RunningRouteService } from './running-route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunningRoute } from './entities/running-route.entity';
import { NestjsFormDataModule, MemoryStoredFile } from 'nestjs-form-data';
import { Image } from './entities/image.entity';
import { RouteSecureTag } from './entities/route-secure-tag.entity';
import { RouteRecommendedTag } from './entities/route-recommended-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RunningRoute,
      RouteSecureTag,
      RouteRecommendedTag,
      Image,
    ]),
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [RunningRouteController],
  providers: [RunningRouteService],
})
export class RunningRouteModule {}
