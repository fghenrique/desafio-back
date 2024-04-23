import { Account } from '@/modules/account/account.entity';
import { AccountMailService } from '@/modules/account/services/mail/account-mail.service';
import { UpdateAccountService } from '@/modules/account/services/update-account.service';
import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '../enums/transaction-type.enum';
import { Transaction } from '../transaction.entity';
import ApiError from '@/common/error/entities/api-error.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { getBtcPrice } from '@/common/btc/get-price';

@Injectable()
export class CreateTransactionService {
  constructor(
    private readonly updateAccountService: UpdateAccountService,
    private readonly accountMailService: AccountMailService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async deposit(
    user: User,
    account: Account,
    value: number,
  ): Promise<Transaction> {
    const { name, email } = user;

    const accountData: Account = {
      ...account,
      brl_balance: account.brl_balance + value,
    };

    const transaction = new Transaction();
    transaction.type = TransactionType.DEPOSIT;
    transaction.account_id = account.id;
    transaction.brl_amount = value;

    const dbTransaction = await this.transactionRepository.create(transaction);

    await this.updateAccountService.updateAccount(account.id, accountData);
    await this.accountMailService.sendMail(
      email,
      'Depósito realizado na sua conta!',
      { name, value },
      process.env.SENDGRID_DEPOSIT_EMAIL,
    );
    return dbTransaction;
  }

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

  async buyBtc(user: User, account: Account, btcAmount: number) {
    const { name, email } = user;

    const buyPrice = Number((await getBtcPrice()).buy);
    const canBuy = buyPrice * btcAmount <= account.brl_balance;
    if (!canBuy)
      throw new ApiError(
        'invalid-amount',
        'Valor maior do que o permitido',
        400,
      );

    const transaction = new Transaction();
    transaction.account_id = account.id;
    transaction.type = TransactionType.BUY;
    transaction.brl_amount = buyPrice * btcAmount;
    transaction.btc_price_at_time = buyPrice;
    transaction.btc_amount = btcAmount;
    const dbTransaction = await this.transactionRepository.create(transaction);

    const accountData: Account = {
      ...account,
      brl_balance: account.brl_balance - transaction.brl_amount,
      btc_balance: account.btc_balance + btcAmount,
    };
    await this.updateAccountService.updateAccount(account.id, accountData);

    await this.accountMailService.sendMail(
      email,
      'Compra de BTC por BRL!',
      { name, btcAmount, buyPrice, brlAmount: transaction.brl_amount },
      process.env.SENDGRID_WITHDRAW_EMAIL,
    );

    return dbTransaction;
  }

  async sellBtc(user: User, account: Account, btcAmount: number) {
    const { name, email } = user;

    const sellPrice = Number((await getBtcPrice()).sell);
    const canSell = btcAmount <= account.btc_balance;
    if (!canSell)
      throw new ApiError(
        'invalid-amount',
        'Valor maior do que o permitido',
        400,
      );

    const transaction = new Transaction();
    transaction.account_id = account.id;
    transaction.type = TransactionType.SELL;
    transaction.brl_amount = sellPrice * btcAmount;
    transaction.btc_price_at_time = sellPrice;
    transaction.btc_amount = btcAmount;
    const dbTransaction = await this.transactionRepository.create(transaction);

    const accountData: Account = {
      ...account,
      brl_balance: account.brl_balance + transaction.brl_amount,
      btc_balance: account.btc_balance - btcAmount,
    };
    await this.updateAccountService.updateAccount(account.id, accountData);

    await this.accountMailService.sendMail(
      email,
      'Venda de BTC por BRL!',
      { name, btcAmount, sellPrice, brlAmount: transaction.brl_amount },
      process.env.SENDGRID_WITHDRAW_EMAIL,
    );

    return dbTransaction;
  }
}
