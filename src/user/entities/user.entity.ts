import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RunningRoute } from '../../running-route/entities/running-route.entity';
import { Bookmark } from './bookmark.entity';
import { Like } from './like.entity';
import { UserTag } from './user-tag.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  userId: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'int' })
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
