import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRecommendedTag } from './entities/user-recommended-tag.entity';
import { UserSecureTag } from './entities/user-secure-tag.entity';
import { Bookmark } from './entities/bookmark.entity';
import { RunningRoute } from 'src/running-route/entities/running-route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRecommendedTag,
      UserSecureTag,
      Bookmark,
      RunningRoute,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
