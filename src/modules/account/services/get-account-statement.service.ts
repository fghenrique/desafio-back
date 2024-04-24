import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Transaction } from '@/modules/transactions/transaction.entity';
import { QueryStatementDto } from '../dtos/statement-query.dto';

@Injectable()
export class GetAccountStatementService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountStatement(
    accountId: string,
    options: QueryStatementDto,
  ): Promise<Transaction[]> {
    const { transactions } = await this.accountRepository.getAccountStatement(
      accountId,
      options,
    );
    return transactions;
  }
}
