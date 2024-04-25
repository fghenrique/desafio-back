import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeormTransactionRepository } from './repositories/typeorm/transaction.repository';
import {
  TransactionBtcBuyController,
  TransactionBtcPriceController,
  TransactionBtcSellController,
  TransactionDepositController,
  TransactionWithdrawController,
} from './controllers';
import {
  BtcBuyTransactionService,
  BtcSellTransactionService,
  DepositTransactionService,
  WithdrawTransactionService,
} from './services';

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
