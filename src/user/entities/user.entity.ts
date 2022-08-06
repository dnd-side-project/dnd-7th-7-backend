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
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @PrimaryColumn({ type: 'varchar', length: 20 })
  userId: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'int', default: 0 })
  numberOfUse: number;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 1 })
  gender: string;

  @Column({ type: 'varchar', length: 50 })
  address: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
