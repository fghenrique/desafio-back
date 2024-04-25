import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/modules/user/user.entity';

@Controller('account')
export class AccountBalanceController {
  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Req() req: Request) {
    const { account } = req.user as User;
    const { brl_balance, btc_balance } = account;
    return { ok: true, brl_balance, btc_balance };
  }
}
