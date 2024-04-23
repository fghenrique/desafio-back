import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Account } from '../account.entity';

@Injectable()
export class UpdateAccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async updateAccount(
    accountId: string,
    accountData: Account,
  ): Promise<Account> {
    return await this.accountRepository.updateAccount(accountId, accountData);
  }
}
