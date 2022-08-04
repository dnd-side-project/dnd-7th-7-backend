import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRoute } from './entities/running-route.entity';
import { RouteTag } from './entities/route-tag.entities';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

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
    const { arrayOfPos, runningTime, review, runningDate, tags, file } =
      createRunningRouteDto;

    const startPoint = `${arrayOfPos[0].latitude} ${arrayOfPos[0].longitude}`;

    const result = arrayOfPos.map((v) => {
      return `${v.latitude} ${v.longitude}`;
    });

    const linestring = result.join(',');

    const key = `${Date.now() + file.originalName}`;
    const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key };

    // aws s3 upload
    const upload = await s3
      .putObject({
        Key: key,
        Body: file.buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
      })
      .promise();

    // image url
    if (upload) {
      const imageUrl: string = await new Promise((r) =>
        s3.getSignedUrl('getObject', params, async (err, url) => {
          if (err) {
            console.log(err);
          }
          r(url.split('?')[0]); // return the url
        }),
      );

      if (imageUrl) {
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
      } else {
        // todo: error handling
      }
    } else {
      // todo: error handling
    }
  }
}
