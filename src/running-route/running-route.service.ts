import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRunningRouteDto } from './dto/create-running-route.dto';
import { RunningRoute } from './entities/running-route.entity';
import * as AWS from 'aws-sdk';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Image } from './entities/image.entity';
import { runOnTransactionRollback, Transactional } from 'typeorm-transactional';
import { RouteRecommendedTag } from './entities/route-recommended-tag.entity';
import { RouteSecureTag } from './entities/route-secure-tag.entity';
import { Geometry } from 'wkx';
import { UpdateRunningRouteDto } from './dto/update-running-route.dto';

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

    @InjectRepository(RouteRecommendedTag)
    private routeRecommendedTagRepository: Repository<RouteRecommendedTag>,

    @InjectRepository(RouteSecureTag)
    private routeSecureTagRepository: Repository<RouteSecureTag>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    this.runningRouteRepository = runningRouteRepository;
    this.routeRecommendedTagRepository = routeRecommendedTagRepository;
    this.routeSecureTagRepository = routeSecureTagRepository;
    this.imageRepository = imageRepository;
  }

  async uploadToAws(image: MemoryStoredFile): Promise<object> {
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

    const result = {
      url: imageUrl,
      key: key,
    };
    return result;
  }

  async deleteImageToAws(key: string) {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
  }

  @Transactional()
  async create(createRunningRouteDto: CreateRunningRouteDto): Promise<any> {
    const {
      arrayOfPos,
      runningTime,
      review,
      distance,
      firstLocation,
      secondLocation,
      thirdLocation,
      runningDate,
      routeImage,
      recommendedTags,
      secureTags,
      files,
      mainRoute,
    } = createRunningRouteDto;

    const startPoint = `${arrayOfPos[0].latitude} ${arrayOfPos[0].longitude}`;

    const route = arrayOfPos.map((v) => {
      return `${v.latitude} ${v.longitude}`;
    });

    const linestring = route.join(',');

    if (mainRoute) {
      const route = await this.runningRouteRepository.findOneBy({
        id: mainRoute,
      });

      if (!route) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['Not Existed mainRoute'],
          error: 'Forbidden',
        });
      }
    }

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
          distance: () => `'+${distance}'`,
          runningDate: () => `'${runningDate}'`,
          routeImage: () => `'${value['url']}'`,
          key: () => `'${value['key']}'`,
          firstLocation: () => `'${firstLocation}'`,
          secondLocation: () => `'${secondLocation}'`,
          thirdLocation: () => `'${thirdLocation}'`,
          mainRoute: () => (mainRoute ? `'${mainRoute}'` : null),
          // todo: add user
        })
        .execute();

      const routeId = runningRoute.identifiers[0].id;

      if (runningRoute) {
        if (recommendedTags) {
          recommendedTags.map(async (tag) => {
            await this.routeRecommendedTagRepository.save({
              index: +tag,
              runningRoute: routeId,
            });
          });
        }

        if (secureTags) {
          secureTags.map(async (tag) => {
            await this.routeSecureTagRepository.save({
              index: +tag,
              runningRoute: routeId,
            });
          });
        }

        if (files) {
          files.map((file) => {
            this.uploadToAws(file).then(async (value) => {
              await this.imageRepository.save({
                routeImage: value['url'],
                key: value['key'],
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

  LinestringToArray(data: Geometry): Array<object> {
    const linestring = data.toString();
    const temp = linestring.slice(11, -1);
    const points = temp.split(',');

    const arrayOfPos = [];

    points.map((point) => {
      arrayOfPos.push({
        latitude: +point.split(' ')[0],
        longitude: +point.split(' ')[1],
      });
    });

    return arrayOfPos;
  }

  async getById(id: number): Promise<object> {
    const route = await this.runningRouteRepository.findOne({
      where: { id: id },
      relations: [
        'routeRecommendedTags',
        'routeSecureTags',
        'images',
        'mainRoute',
      ],
    });

    if (!route) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Route with ID ${id} not found`],
        error: 'NotFound',
      });
    }

    const result = {
      id: route.id,
      arrayOfPos: this.LinestringToArray(route.arrayOfPos),
      runningTime: route.runningTime,
      review: route.review,
      distance: route.distance,
      firstLocation: route.firstLocation,
      secondLocation: route.secondLocation,
      thirdLocation: route.thirdLocation,
      runningDate: route.runningDate,
      routeImage: route.routeImage,
      recommendedTags: route.routeRecommendedTags.map((tag) => tag.index),
      secureTags: route.routeSecureTags.map((tag) => tag.index),
      files: route.images.map((image) => image.routeImage),
      mainRoute: route.mainRoute ? route.mainRoute.id : null,
    };

    return result;
  }

  async update(id: number, updateRunningRouteDto: UpdateRunningRouteDto) {
    const route = await this.runningRouteRepository.findOne({
      where: { id: id },
      relations: ['routeRecommendedTags', 'routeSecureTags', 'images'],
    });

    if (!route) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Route with ID ${id} not found`],
        error: 'NotFound',
      });
    }

    const { review, recommendedTags, secureTags, files } =
      updateRunningRouteDto;

    if (review) {
      await this.runningRouteRepository.update(id, { review });
    }

    if (recommendedTags) {
      if (route.routeRecommendedTags !== undefined) {
        route.routeRecommendedTags.map(async (tag) => {
          await this.routeRecommendedTagRepository.delete({
            id: tag.id,
          });
        });
      }
      recommendedTags.map(async (tag) => {
        await this.routeRecommendedTagRepository.save({
          index: +tag,
          runningRoute: route,
        });
      });
    }

    if (secureTags) {
      if (route.routeSecureTags !== undefined) {
        route.routeSecureTags.map(async (tag) => {
          await this.routeSecureTagRepository.delete({
            id: tag.id,
          });
        });
      }
      secureTags.map(async (tag) => {
        await this.routeSecureTagRepository.save({
          index: +tag,
          runningRoute: route,
        });
      });
    }

    if (files) {
      if (route.images !== undefined) {
        route.images.map(async (image) => {
          this.deleteImageToAws(image.key);
          await this.imageRepository.delete({
            id: image.id,
          });
        });
      }

      files.map((file) => {
        this.uploadToAws(file).then(async (value) => {
          await this.imageRepository.save({
            routeImage: value['url'],
            key: value['key'],
            runningRoute: route,
          });
        });
      });
    }
  }

  async delete(id: number) {
    const route = await this.runningRouteRepository.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!route) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Route with ID ${id} not found`],
        error: 'NotFound',
      });
    }

    this.deleteImageToAws(route.key);

    if (route.images !== undefined) {
      route.images.map(async (image) => await this.deleteImageToAws(image.key));
    }

    await this.runningRouteRepository.delete(route.id);
  }
}
