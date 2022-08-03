import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRoute } from './entities/running-route.entity';
import { RouteTag } from './entities/route-tag.entities';

@Injectable()
export class RunningRouteService {
  constructor(
    @InjectRepository(RunningRoute)
    private runningRouteRepository: Repository<RunningRoute>,

    @InjectRepository(RouteTag)
    private routeTagRepository: Repository<RouteTag>,
  ) {
    this.runningRouteRepository = runningRouteRepository;
    this.routeTagRepository = routeTagRepository;
  }

  async create(createRunningRouteDto: CreateRunningRouteDto) {
    const { arrayOfPos, runningTime, review, runningDate, tags } =
      createRunningRouteDto;

    const startPoint = `${arrayOfPos[0].latitude} ${arrayOfPos[0].longitude}`;

    const result = arrayOfPos.map((v) => {
      return `${v.latitude} ${v.longitude}`;
    });

    const linestring = result.join(',');

    const imageUrl = ''; // fix: amazon s3 image url

    // todo: find user with token

    try {
      const runningRoute = await this.runningRouteRepository
        .createQueryBuilder()
        .insert()
        .into(RunningRoute)
        .values({
          startPoint: () => `ST_GeomFromText('POINT(${startPoint})')`,
          arrayOfPos: () => `ST_GeomFromText('LINESTRING(${linestring})')`,
          runningTime: () => `'${runningTime}'`,
          review: () => `'${review}'`,
          runningDate: () => `'${runningDate}'`,
          routeImage: () => `'${imageUrl}'`,
          // todo: add user
        })
        .execute();

      tags.map(async (tag) => {
        await this.routeTagRepository.save({
          index: tag,
          runningRoute: runningRoute.identifiers[0].id,
        });
      });
    } catch (err) {
      throw err; // todo: error handling
    }
  }
}
