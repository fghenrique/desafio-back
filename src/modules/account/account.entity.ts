import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  money_balance: number;

  @Column({ type: 'float', default: 0 })
  bitcoin_balance: number;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
