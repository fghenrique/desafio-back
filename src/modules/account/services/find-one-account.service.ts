import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account.repository';
import { FindOneAccountOptions } from '../interfaces/find-one-account-options.interface';
import { Account } from '../account.entity';

@Injectable()
export class FindOneAccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findAccount(options: FindOneAccountOptions): Promise<Account> {
    return await this.accountRepository.findOne(options);
  }
}
