import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiError from '@/common/error/entities/api-error.entity';
import { TransactionType } from '@/modules/transactions/enums/transaction-type.enum';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';
import { AccountRepository } from '../account.repository';
import { Account } from '../../account.entity';
import { FindOneAccountOptions } from '../../interfaces/find-one-account-options.interface';
import moment from '@/common/libs/moment';

@Injectable()
export class TypeormAccountRepository implements AccountRepository {
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
    options: QueryTimeIntervalDto,
  ): Promise<Account> {
    const { start_date, end_date } = options;

    const qb = this.accountRepository.createQueryBuilder('accounts');
    qb.leftJoinAndSelect('accounts.transactions', 'transactions');
    qb.andWhere('accounts.id = :accountId', { accountId });
    qb.andWhere('transactions.created_at BETWEEN :start_date AND :end_date', {
      start_date,
      // on SQL a date like YYYY-MM-DD means YYYY-MM-DD 00:00:00 so we force it to be 23:59:59
      end_date: moment(end_date).format('YYYY-MM-DDT23:59:59.999Z'),
    });

    const account = await qb.getOne();
    return account;
  }

  async getAllBuyInfo(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<{
    btc_amount_bought: number;
    brl_amount_bought: number;
    average_buy_price: number;
  }> {
    const { start_date, end_date } = options;

    const qb = this.accountRepository.createQueryBuilder('accounts');
    qb.leftJoinAndSelect('accounts.transactions', 'transactions');

    qb.andWhere('transactions.created_at BETWEEN :start_date AND :end_date', {
      start_date,
      end_date: moment(end_date).format('YYYY-MM-DDT23:59:59.999Z'),
    });

    qb.andWhere('accounts.id = :accountId', { accountId });
    qb.andWhere('transactions.type = :type', { type: TransactionType.BUY });

    qb.select('SUM(transactions.btc_amount)', 'btc_amount_bought');
    qb.addSelect('SUM(transactions.brl_amount)', 'brl_amount_bought');
    qb.addSelect('AVG(transactions.btc_price_at_time)', 'average_buy_price');

    const res = await qb.getRawOne();

    return {
      brl_amount_bought: res.brl_amount_bought ?? 0,
      btc_amount_bought: res.btc_amount_bought ?? 0,
      average_buy_price: res.average_buy_price ?? 0,
    };
  }

  async getAllSellInfo(
    accountId: string,
    options: QueryTimeIntervalDto,
  ): Promise<{
    btc_amount_sold: number;
    brl_amount_sold: number;
    average_sell_price: number;
  }> {
    const { start_date, end_date } = options;

    const qb = this.accountRepository.createQueryBuilder('accounts');
    qb.leftJoinAndSelect('accounts.transactions', 'transactions');

    qb.andWhere('transactions.created_at BETWEEN :start_date AND :end_date', {
      start_date,
      end_date: moment(end_date).format('YYYY-MM-DDT23:59:59.999Z'),
    });

    qb.andWhere('accounts.id = :accountId', { accountId });
    qb.andWhere('transactions.type = :type', { type: TransactionType.SELL });

    qb.select('SUM(transactions.btc_amount)', 'btc_amount_sold');
    qb.addSelect('SUM(transactions.brl_amount)', 'brl_amount_sold');
    qb.addSelect('AVG(transactions.btc_price_at_time)', 'average_sell_price');

    const res = await qb.getRawOne();

    return {
      btc_amount_sold: res.brl_amount_sold ?? 0,
      brl_amount_sold: res.btc_amount_sold ?? 0,
      average_sell_price: res.average_buy_price ?? 0,
    };
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
