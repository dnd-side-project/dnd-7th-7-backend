import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RunningRoute } from '../../running-route/entities/running-route.entity';
import { User } from './user.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @ManyToOne(() => RunningRoute, (runningRoute) => runningRoute.bookmarks)
  runningRoute: RunningRoute;
}
