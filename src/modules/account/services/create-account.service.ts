import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { Account } from '../account.entity';

@Injectable()
export class CreateAccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(account: Account): Promise<Account> {
    return await this.accountRepository.create(account);
  }
}
