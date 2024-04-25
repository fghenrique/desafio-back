import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/modules/user/user.entity';
import moment from '@/common/libs/moment';
import ApiError from '@/common/error/entities/api-error.entity';
import { QueryTimeIntervalDto } from '@/common/dtos/query-time-interval.dto';
import { GetAccountPositionService } from '../services/get-account-position.service';

@Controller('account')
export class AccountPositionController {
  constructor(
    private readonly getAccountPositionService: GetAccountPositionService,
  ) {}

  @Get('position')
  @UseGuards(JwtAuthGuard)
  async getPosition(@Req() req: Request, @Query() query: QueryTimeIntervalDto) {
    const { id, brl_balance, btc_balance } = (req.user as User).account;

    const {
      start_date = moment().subtract(90, 'd').format('YYYY-MM-DD'),
      end_date = moment().format('YYYY-MM-DD'),
    } = query;

    if (moment(start_date).isAfter(moment(end_date)))
      throw new ApiError('invalid-period', 'Intervalo de datas inválido', 400);

    const info = await this.getAccountPositionService.getPosition(id, {
      start_date,
      end_date,
    });

    return { ok: true, info: { brl_balance, btc_balance, ...info } };
  }
}
