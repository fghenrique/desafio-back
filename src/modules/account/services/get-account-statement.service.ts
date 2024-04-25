import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Transaction } from '@/modules/transactions/transaction.entity';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';

@Injectable()
export class GetAccountStatementService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountStatement(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<Transaction[]> {
    const account = await this.accountRepository.getAccountStatement(
      accountId,
      options,
    );
    return account?.transactions ?? [];
  }
}
