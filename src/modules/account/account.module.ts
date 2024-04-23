import { Module } from '@nestjs/common';
import { CreateAccountService } from './services/create-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './repositories/account.repository';
import { AccountController } from './controllers/account.controller';
import { FindOneAccountService } from './services/find-one-account.service';
import { UpdateAccountService } from './services/update-account.service';
import { AccountMailService } from './services/mail/account-mail.service';

@Module({
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    CreateAccountService,
    AccountRepository,
    FindOneAccountService,
    UpdateAccountService,
    AccountMailService,
  ],
  exports: [CreateAccountService, UpdateAccountService, AccountMailService],
})
export class AccountModule {}
