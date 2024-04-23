import { Injectable } from '@nestjs/common';
import { Account } from '../account.entity';
import { UpdateAccountService } from './update-account.service';
import { AccountMailService } from './mail/account-mail.service';
import { User } from '@/modules/user/user.entity';

@Injectable()
export class DepositAccountService {
  constructor(
    private readonly updateAccountService: UpdateAccountService,
    private readonly accountMailService: AccountMailService,
  ) {}

  async depositValue(
    user: User,
    account: Account,
    value: number,
  ): Promise<Account> {
    const accountData: Account = {
      ...account,
      money_balance: account.money_balance + value,
    };

    const updatedAccount = await this.updateAccountService.updateAccount(
      account.id,
      accountData,
    );

    const { name, email } = user;
    await this.accountMailService.sendDepositEmail(email, name, value);

    return updatedAccount;
  }
}
