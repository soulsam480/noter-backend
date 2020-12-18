import { Token } from './Token';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

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

  @OneToMany(() => Token, (tokens) => tokens.user)
  tokens: Token;

  @CreateDateColumn()
  createdAt: Date;
}
