import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { TransactionType } from './enums/transaction-type.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'float' })
  brl_amount: number;

  @Column({ type: 'float', nullable: true })
  btc_amount: number;

  @Column({ type: 'float', nullable: true })
  btc_price_at_time: number;

  @CreateDateColumn()
  created_at: Date;
}
