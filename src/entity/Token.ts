import { User } from './User';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  tokenId: string;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
