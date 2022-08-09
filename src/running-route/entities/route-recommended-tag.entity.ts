import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { RunningRoute } from './running-route.entity';

@Entity()
export class RouteRecommendedTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  index: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => RunningRoute,
    (runningRoute) => runningRoute.routeRecommendedTags,
  )
  runningRoute: RunningRoute;
}
