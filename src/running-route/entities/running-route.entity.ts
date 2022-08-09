import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Geometry } from 'wkx';
import { User } from '../../user/entities/user.entity';
import { Bookmark } from '../../user/entities/bookmark.entity';
import { Like } from '../../user/entities/like.entity';
import { RouteRecommendedTag } from './route-recommended-tag.entity';
import { RouteSecureTag } from './route-secure-tag.entity';
import { Image } from './image.entity';

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
  firstLocation: string;

  @Column({ type: 'varchar' })
  secondLocation: string;

  @Column({ type: 'varchar' })
  thirdLocation: string;

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

  @OneToMany(() => RouteRecommendedTag, (tag) => tag.runningRoute)
  routeRecommendedTags: RouteRecommendedTag[];

  @OneToMany(() => RouteSecureTag, (tag) => tag.runningRoute)
  routeSecureTags: RouteSecureTag[];

  @OneToMany(() => Image, (image) => image.runningRoute)
  images: Image[];

  @ManyToOne(() => RunningRoute, (runningRoute) => runningRoute.subRoute)
  mainRoute: RunningRoute;

  @OneToMany(() => RunningRoute, (runningRoute) => runningRoute.mainRoute)
  subRoute: RunningRoute[];
}
