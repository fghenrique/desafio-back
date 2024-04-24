import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Transaction } from '@/modules/transactions/transaction.entity';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';
import { getBtcPrice } from '@/common/btc/get-price';

@Injectable()
export class GetAccountStatementService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getPosition(accountId: string, options: QueryTimeIntervalDto) {
    const sellInfo = await this.accountRepository.getAllSellInfo(
      accountId,
      options,
    );
    const buyInfo = await this.accountRepository.getAllBuyInfo(
      accountId,
      options,
    );
    const { last: crrPrice } = await getBtcPrice();

    const sellPrice = sellInfo.average_sell_price;
    const buyPrice = buyInfo.average_buy_price;

    const percentual_profit_on_current_price =
      (((Number(crrPrice) - buyPrice) / buyPrice) * 100).toFixed(2) + '%';

    const percentual_profit_on_avg_sell_price =
      (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(2) + '%';

    return {
      ...sellInfo,
      ...buyInfo,
      percentual_profit_on_current_price,
      percentual_profit_on_avg_sell_price,
    };
  }

  async getAccountStatement(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<Transaction[]> {
    const { transactions } = await this.accountRepository.getAccountStatement(
      accountId,
      options,
    );
    return transactions;
  }
}
