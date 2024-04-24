import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/modules/user/user.entity';
import { GetAccountStatementService } from '../services/get-account-statement.service';
import moment from '@/common/libs/moment';
import ApiError from '@/common/error/entities/api-error.entity';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly getAccountStatementService: GetAccountStatementService,
  ) {}
  logger = new Logger(AccountController.name);

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Req() req: Request) {
    const { account } = req.user as User;
    const { brl_balance, btc_balance } = account;
    return { ok: true, brl_balance, btc_balance };
  }

  @Get('statement')
  @UseGuards(JwtAuthGuard)
  async getStatement(
    @Req() req: Request,
    @Query() query: QueryTimeIntervalDto,
  ) {
    const { account } = req.user as User;
    const {
      start_date = moment().subtract(90, 'd').format('YYYY-MM-DD'),
      end_date = moment().format('YYYY-MM-DD'),
    } = query;

    if (moment(start_date).isSameOrAfter(moment(end_date)))
      throw new ApiError('invalid-period', 'Intervalo de datas inválido', 400);

    const transactions =
      await this.getAccountStatementService.getAccountStatement(account.id, {
        start_date,
        end_date,
      });
    return { ok: true, transactions };
  }

  @Get('position')
  @UseGuards(JwtAuthGuard)
  async getPosition(@Req() req: Request, @Query() query: QueryTimeIntervalDto) {
    const { id, brl_balance, btc_balance } = (req.user as User).account;

    const {
      start_date = moment().subtract(90, 'd').format('YYYY-MM-DD'),
      end_date = moment().format('YYYY-MM-DD'),
    } = query;

    if (moment(start_date).isSameOrAfter(moment(end_date)))
      throw new ApiError('invalid-period', 'Intervalo de datas inválido', 400);

    const info = await this.getAccountStatementService.getPosition(id, {
      start_date,
      end_date,
    });

    return { ok: true, info: { brl_balance, btc_balance, ...info } };
  }
}
