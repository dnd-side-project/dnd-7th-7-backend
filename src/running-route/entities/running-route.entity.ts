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
import { RouteTag } from './route-tag.entities';
import { Image } from './image.entities';

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

  @Column({ type: 'time' })
  runningTime: string;

  @Column({ type: 'varchar', length: 100 })
  review: string;

  @Column({ type: 'date' })
  runningDate: Date;

  @Column({ type: 'varchar' })
  routeImage: string;

  @Column({ type: 'varchar' })
  location: string; // 시작 위치 정보 (OO시 OO구 OO동)

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

  @OneToMany(() => RouteTag, (routeTag) => routeTag.runningRoute)
  routeTags: RouteTag[];

  @OneToMany(() => Image, (image) => image.runningRoute)
  images: Image[];

  @OneToOne(
    () => RunningRoute,
    (runningRoute) => runningRoute.recommendedRoute,
    { nullable: true },
  )
  recommendedRoute: RunningRoute;
}
