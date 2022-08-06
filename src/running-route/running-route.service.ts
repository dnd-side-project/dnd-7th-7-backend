import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRoute } from './entities/running-route.entity';
import { RouteTag } from './entities/route-tag.entities';
import * as AWS from 'aws-sdk';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Image } from './entities/image.entities';
import { runOnTransactionRollback, Transactional } from 'typeorm-transactional';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});

@Injectable()
export class RunningRouteService {
  constructor(
    @InjectRepository(RunningRoute)
    private runningRouteRepository: Repository<RunningRoute>,

    @InjectRepository(RouteTag)
    private routeTagRepository: Repository<RouteTag>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    this.runningRouteRepository = runningRouteRepository;
    this.routeTagRepository = routeTagRepository;
    this.imageRepository = imageRepository;
  }

  async uploadToAws(image: MemoryStoredFile): Promise<string> {
    const key = `${Date.now() + image.originalName}`;
    const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key };

    // aws s3 upload
    await s3
      .putObject(
        {
          Key: key,
          Body: image.buffer,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
        },
        (err) => {
          if (err) {
            throw err;
          }
        },
      )
      .promise();

    // image url
    const imageUrl: string = await new Promise((r) =>
      s3.getSignedUrl('getObject', params, async (err, url) => {
        if (err) {
          throw err;
        }
        r(url.split('?')[0]);
      }),
    );
    return imageUrl;
  }

  @Transactional()
  async create(createRunningRouteDto: CreateRunningRouteDto): Promise<any> {
    const {
      arrayOfPos,
      runningTime,
      review,
      runningDate,
      tags,
      files,
      routeImage,
      location,
    } = createRunningRouteDto;

    const startPoint = `${arrayOfPos[0].latitude} ${arrayOfPos[0].longitude}`;

    const route = arrayOfPos.map((v) => {
      return `${v.latitude} ${v.longitude}`;
    });
    const linestring = route.join(',');

    const result = this.uploadToAws(routeImage).then(async (value) => {
      const runningRoute = await this.runningRouteRepository
        .createQueryBuilder()
        .insert()
        .into(RunningRoute)
        .values({
          startPoint: () => `ST_GeomFromText('POINT(${startPoint})')`,
          arrayOfPos: () => `ST_GeomFromText('LINESTRING(${linestring})')`,
          runningTime: () => `'${runningTime}'`,
          review: () => `'${review}'`,
          location: () => `'${location}'`,
          runningDate: () => `'${runningDate}'`,
          routeImage: () => `'${value}'`,
          // todo: add user
        })
        .execute();

      const routeId = runningRoute.identifiers[0].id;

      if (runningRoute) {
        tags.map(async (tag) => {
          await this.routeTagRepository.save({
            index: +tag,
            runningRoute: routeId,
          });
        });

        if (files) {
          files.map((file) => {
            this.uploadToAws(file).then(async (value) => {
              await this.imageRepository.save({
                routeImage: value,
                runningRoute: routeId,
              });
            });
          });
        }
      } else {
        runOnTransactionRollback((e) => console.log(e));
      }
      return routeId;
    });
    return result;
  }
}
