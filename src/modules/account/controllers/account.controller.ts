import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DepositAccountService } from '../services/deposit-on-account.service';
import { Request } from 'express';
import { ValueDto } from '../dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { getBtcPrice } from '@/common/btc/get-price';

@Controller('account')
export class AccountController {
  constructor(private readonly depositAccountService: DepositAccountService) {}
  logger = new Logger();

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Req() req: Request, @Body() valueDto: ValueDto) {
    const user = req.user as User;
    const updatedAccount = await this.depositAccountService.depositValue(
      user,
      user.account,
      valueDto.value,
    );
    return { ok: true, account: updatedAccount };
  }

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
