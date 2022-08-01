import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RunningRoute } from './running-route/entities/running-route.entity';
import { Bookmark } from './user/entities/bookmark.entity';
import { Like } from './user/entities/like.entity';
import { UserTag } from './user/entities/user-tag.entity';
import { RouteTag } from './running-route/entities/route-tag.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLDB_HOST,
      port: parseInt(process.env.MYSQLDB_DOCKER_PORT, 10),
      username: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_PASSWORD,
      database: process.env.MYSQLDB_DATABASE,
      entities: [User, RunningRoute, Bookmark, Like, UserTag, RouteTag],
      synchronize: true, // Fix me : set this value to false when deploy
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
