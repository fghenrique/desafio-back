import { TransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetMetricsVolumeService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getVolume(): Promise<{
    total_btc_bought: number;
    total_btc_sold: number;
  }> {
    const volume = await this.transactionRepository.getVolume();

    return {
      total_btc_bought: volume.total_btc_bought ?? 0,
      total_btc_sold: volume.total_btc_sold ?? 0,
    };
  }
}
