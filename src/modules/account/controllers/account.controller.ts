import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/modules/user/user.entity';
import { getBtcPrice } from '@/common/btc/get-price';

@Controller('account')
export class AccountController {
  logger = new Logger(AccountController.name);

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Req() req: Request) {
    const { account } = req.user as User;
    return { ok: true, saldo: account.money_balance };
  }

  @Get('price')
  @UseGuards(JwtAuthGuard)
  async getPrice() {
    const price = await getBtcPrice();
    return { ok: true, price };
  }
}
