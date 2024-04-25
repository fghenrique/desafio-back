import { Account } from '@/modules/account/account.entity';
import { AccountMailService } from '@/modules/account/services/mail/account-mail.service';
import { UpdateAccountService } from '@/modules/account/services/update-account.service';
import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '../enums/transaction-type.enum';
import { Transaction } from '../transaction.entity';
import ApiError from '@/common/error/entities/api-error.entity';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class WithdrawTransactionService {
  constructor(
    private readonly updateAccountService: UpdateAccountService,
    private readonly accountMailService: AccountMailService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async withdraw(user: User, account: Account, value: number) {
    if (value > account.brl_balance)
      throw new ApiError(
        'invalid-amount',
        'Valor maior do que o permitido',
        400,
      );
    const { name, email } = user;

    const accountData: Account = {
      ...account,
      brl_balance: account.brl_balance - value,
    };

    const transaction = new Transaction();
    transaction.type = TransactionType.WITHDRAW;
    transaction.account_id = account.id;
    transaction.brl_amount = value;

    const dbTransaction = await this.transactionRepository.create(transaction);

    await this.updateAccountService.updateAccount(account.id, accountData);

    await this.accountMailService.sendMail(
      email,
      'Saque realizado na sua conta!',
      { name, value },
      process.env.SENDGRID_WITHDRAW_EMAIL,
    );

    return dbTransaction;
  }
}
