import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Geometry } from 'wkx';
import { User } from '../../user/entities/user.entity';
import { Bookmark } from '../../user/entities/bookmark.entity';
import { Like } from '../../user/entities/like.entity';

@Entity()
export class RunningRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'point' })
  startPoint: Geometry;

  @Column({
    type: 'linestring',
  })
  arrayOfPos: Geometry;

  @Column({ type: 'int' })
  tags: number;

  @Column({ type: 'time' })
  runningTime: string;

  @Column({ type: 'varchar', length: 100 })
  review: string;

  @Column({ type: 'date' })
  runningDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.runningRoutes)
  user: User;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.runningRoute)
  bookmarks: Bookmark[];

  @OneToMany(() => Like, (like) => like.runningRoute)
  likes: Like[];

  @OneToOne(
    () => RunningRoute,
    (runningRoute) => runningRoute.recommendedRoute,
    { nullable: true },
  )
  recommendedRoute: RunningRoute;
}
