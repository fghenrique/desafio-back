import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeormTransactionRepository } from './repositories/typeorm/transaction.repository';
import { BtcBuyTransactionService } from './services/btc-buy-transaction.service';
import { BtcSellTransactionService } from './services/btc-sell-transaction.service';
import { DepositTransactionService } from './services/deposit-transaction.service';
import { WithdrawTransactionService } from './services/withdraw-transaction.service';
import { TransactionDepositController } from './controllers/transaction-deposit.controller';
import { TransactionWithdrawController } from './controllers/transaction-withdraw.controller';
import { TransactionBtcBuyController } from './controllers/transaction-btc-buy.controller';
import { TransactionBtcSellController } from './controllers/transaction-btc-sell.controller';
import { TransactionBtcPriceController } from './controllers/transaction-btc-price.controller';

@Module({
  controllers: [
    TransactionDepositController,
    TransactionWithdrawController,
    TransactionBtcBuyController,
    TransactionBtcSellController,
    TransactionBtcPriceController,
  ],
  imports: [AccountModule, TypeOrmModule.forFeature([Transaction])],
  providers: [
    BtcBuyTransactionService,
    BtcSellTransactionService,
    DepositTransactionService,
    WithdrawTransactionService,
    { provide: TransactionRepository, useClass: TypeormTransactionRepository },
  ],
  exports: [TransactionRepository],
})
export class TransactionModule {}
