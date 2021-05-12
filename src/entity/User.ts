import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Board } from './Board';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'text', nullable: false })
  username: string;

  @Column({ unique: true, type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  imgUrl: string;

  @OneToMany(() => Board, (boards) => boards.user)
  boards: Board;

  @CreateDateColumn()
  createdAt: Date;
}
