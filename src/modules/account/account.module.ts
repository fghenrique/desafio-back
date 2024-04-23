import { Module } from '@nestjs/common';
import { CreateAccountService } from './services/create-account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './repositories/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [CreateAccountService, AccountRepository],
  exports: [CreateAccountService],
})
export class AccountModule {}
