import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionService } from './services/create-transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  controllers: [TransactionController],
  imports: [AccountModule, TypeOrmModule.forFeature([Transaction])],
  providers: [CreateTransactionService, TransactionRepository],
  exports: [TransactionRepository],
})
export class TransactionModule {}
