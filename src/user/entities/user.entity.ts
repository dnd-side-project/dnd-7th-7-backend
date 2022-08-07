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
import { UserTag } from './user-tag.entity';

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

  @OneToMany(() => UserTag, (userTag) => userTag.user)
  userTags: UserTag[];
}
