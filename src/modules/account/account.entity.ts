import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  brl_balance: number;

  @Column({ type: 'float', default: 0 })
  btc_balance: number;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
