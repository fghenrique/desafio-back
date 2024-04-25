import { Injectable } from '@nestjs/common';
import { Transaction } from '../transaction.entity';

@Injectable()
export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<Transaction>;

  abstract getVolume(): Promise<{
    total_btc_bought: number;
    total_btc_sold: number;
  }>;
}
