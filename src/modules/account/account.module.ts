import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './repositories/account.repository';
import { TypeormAccountRepository } from './repositories/typeorm/account.repository';
import {
  AccountBalanceController,
  AccountPositionController,
  AccountStatementController,
} from './controllers';
import {
  AccountMailService,
  CreateAccountService,
  FindOneAccountService,
  GetAccountPositionService,
  GetAccountStatementService,
  UpdateAccountService,
} from './services';

@Module({
  controllers: [
    AccountBalanceController,
    AccountStatementController,
    AccountPositionController,
  ],
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    CreateAccountService,
    {
      provide: AccountRepository,
      useClass: TypeormAccountRepository,
    },
    FindOneAccountService,
    UpdateAccountService,
    AccountMailService,
    GetAccountStatementService,
    GetAccountPositionService,
  ],
  exports: [CreateAccountService, UpdateAccountService, AccountMailService],
})
export class AccountModule {}
