import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RunningRoute } from './running-route/entities/running-route.entity';
import { Bookmark } from './user/entities/bookmark.entity';
import { Like } from './user/entities/like.entity';
import { RunningRouteModule } from './running-route/running-route.module';
import { Image } from './running-route/entities/image.entity';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { RouteRecommendedTag } from './running-route/entities/route-recommended-tag.entity';
import { RouteSecureTag } from './running-route/entities/route-secure-tag.entity';
import { AuthModule } from './auth/auth.module';
import { UserRecommendedTag } from './user/entities/user-recommended-tag.entity';
import { UserSecureTag } from './user/entities/user-secure-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env.MYSQLDB_HOST,
          port: parseInt(process.env.MYSQLDB_DOCKER_PORT, 10),
          username: process.env.MYSQLDB_USER,
          password: process.env.MYSQLDB_PASSWORD,
          database: process.env.MYSQLDB_DATABASE,
          entities: [
            User,
            UserRecommendedTag,
            UserSecureTag,
            RunningRoute,
            Bookmark,
            Like,
            RouteRecommendedTag,
            RouteSecureTag,
            Image,
          ],
          synchronize: true, // Fix me : set this value to false when deploy
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UserModule,
    RunningRouteModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
