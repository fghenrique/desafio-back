import { Module } from '@nestjs/common';
import { CreateAccountService } from './services/create-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './repositories/account.repository';
import { FindOneAccountService } from './services/find-one-account.service';
import { UpdateAccountService } from './services/update-account.service';
import { AccountMailService } from './services/mail/account-mail.service';
import { GetAccountStatementService } from './services/get-account-statement.service';
import { TypeormAccountRepository } from './repositories/typeorm/account.repository';
import { GetAccountPositionService } from './services/get-account-position.service';
import { AccountBalanceController } from './controllers/account-balance.controller';
import { AccountStatementController } from './controllers/account-statement.controller';
import { AccountPositionController } from './controllers/account-position.controller';

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
