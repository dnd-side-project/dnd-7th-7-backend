import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRecommendedTag } from './entities/user-recommended-tag.entity';
import { UserSecureTag } from './entities/user-secure-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRecommendedTag, UserSecureTag]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
