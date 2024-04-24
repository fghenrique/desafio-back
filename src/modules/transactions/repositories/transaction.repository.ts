import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction.entity';
import moment from '@/common/libs/moment';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(transaction: Transaction) {
    return await this.transactionRepository.save(transaction);
  }

  async getVolume(): Promise<{
    total_btc_bought: number;
    total_btc_sold: number;
  }> {
    const qb = this.transactionRepository.createQueryBuilder('transactions');
    qb.where('transactions.created_at >= :date', {
      date: moment().format('YYYY-MM-DD'),
    });

    qb.select(
      "SUM(CASE WHEN transactions.type = 'buy' THEN transactions.btc_amount ELSE 0 END)",
      'total_btc_bought',
    );
    qb.addSelect(
      "SUM(CASE WHEN transactions.type = 'sell' THEN transactions.btc_amount ELSE 0 END)",
      'total_btc_sold',
    );

    const res = await qb.getRawOne();
    return res;
  }
}
