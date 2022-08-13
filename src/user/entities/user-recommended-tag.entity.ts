import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRecommendedTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  index: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userRecommendedTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
