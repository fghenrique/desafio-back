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
export class BtcSellTransactionService {
  constructor(
    private readonly updateAccountService: UpdateAccountService,
    private readonly accountMailService: AccountMailService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

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
      process.env.SENDGRID_SELL_BTC_EMAIL,
    );

    return dbTransaction;
  }
}
