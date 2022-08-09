import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { RunningRoute } from './running-route.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  routeImage: string;

  @Column({ type: 'varchar' })
  key: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => RunningRoute, (runningRoute) => runningRoute.images)
  runningRoute: RunningRoute;
}
