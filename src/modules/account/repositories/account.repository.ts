import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../account.entity';
import { Repository } from 'typeorm';
import { FindOneAccountOptions } from '../interfaces/find-one-account-options.interface';
import ApiError from '@/common/error/entities/api-error.entity';
import { QueryStatementDto } from '../dtos/statement-query.dto';
import moment from '@/common/libs/moment';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(account: Account): Promise<Account> {
    const createdAccount = await this.accountRepository.save(account);
    return createdAccount;
  }

  async findOne(options: FindOneAccountOptions): Promise<Account> {
    const qb = this.accountRepository.createQueryBuilder('accounts');

    if (options.relations) {
      options.relations.forEach((relation) => {
        qb.leftJoinAndSelect(`accounts.${relation}`, relation);
      });
    }

    if (options.key && options.value)
      qb.where(`accounts.${options.key} = :value`, { value: options.value });

    const account = await qb.getOne();
    return account;
  }

  async getAccountStatement(
    accountId: string,
    options: QueryStatementDto,
  ): Promise<Account> {
    const { start_date, end_date } = options;

    const qb = this.accountRepository.createQueryBuilder('accounts');
    qb.leftJoinAndSelect('accounts.transactions', 'transactions');
    qb.andWhere('accounts.id = :accountId', { accountId });
    qb.andWhere('transactions.created_at BETWEEN :start_date AND :end_date', {
      start_date,
      end_date,
    });

    const account = await qb.getOne();
    return account;
  }

  async updateAccount(id: string, data: Account) {
    try {
      const account = await this.findOne({ key: 'id', value: id });
      return await this.accountRepository.save({ ...account, ...data });
    } catch (err) {
      throw new ApiError(
        'error-updating-account',
        'Erro ao atualizar os dados da sua conta, contate o suporte',
        500,
      );
    }
  }
}
