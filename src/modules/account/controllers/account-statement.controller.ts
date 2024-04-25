import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/modules/user/user.entity';
import { GetAccountStatementService } from '../services/get-account-statement.service';
import moment from '@/common/libs/moment';
import ApiError from '@/common/error/entities/api-error.entity';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';

@Controller('account')
export class AccountStatementController {
  constructor(
    private readonly getAccountStatementService: GetAccountStatementService,
  ) {}

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
}
