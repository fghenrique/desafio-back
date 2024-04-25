import { Injectable } from '@nestjs/common';
import { Account } from '../account.entity';
import { FindOneAccountOptions } from '../interfaces/find-one-account-options.interface';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';

@Injectable()
export abstract class AccountRepository {
  abstract create(account: Account): Promise<Account>;

  abstract findOne(options: FindOneAccountOptions): Promise<Account>;

  abstract getAccountStatement(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<Account>;

  abstract getAllBuyInfo(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<{
    btc_amount_bought: number;
    brl_amount_bought: number;
    average_buy_price: number;
  }>;

  abstract getAllSellInfo(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<{
    btc_amount_sold: number;
    brl_amount_sold: number;
    average_sell_price: number;
  }>;

  abstract updateAccount(id: string, data: Account): Promise<Account>;
}
