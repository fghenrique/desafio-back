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
export class BtcBuyTransactionService {
  constructor(
    private readonly updateAccountService: UpdateAccountService,
    private readonly accountMailService: AccountMailService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

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
      process.env.SENDGRID_BUY_BTC_EMAIL,
    );

    return dbTransaction;
  }
}
