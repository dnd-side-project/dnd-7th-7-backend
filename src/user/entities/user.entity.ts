import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RunningRoute } from '../../running-route/entities/running-route.entity';
import { Bookmark } from './bookmark.entity';
import { Like } from './like.entity';
import { UserRecommendedTag } from './user-recommended-tag.entity';
import { UserSecureTag } from './user-secure-tag.entity';

@Entity()
export class User {
  @Column({ type: 'varchar', length: 20, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'int', default: 0 })
  numberOfUse: number;

  @Column({ type: 'int', nullable: true })
  birthDate: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => RunningRoute, (runningRoute) => runningRoute.user)
  runningRoutes: RunningRoute[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(
    () => UserRecommendedTag,
    (userRecommendedTag) => userRecommendedTag.user,
  )
  userRecommendedTags: UserRecommendedTag[];

  @OneToMany(() => UserSecureTag, (userSecureTag) => userSecureTag.user)
  userSecureTags: UserSecureTag[];
}
