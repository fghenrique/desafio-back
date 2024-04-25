import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/common/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';
import { BtcBuyTransactionService } from '../services/btc-buy-transaction.service';

@Controller('transaction')
export class TransactionBtcBuyController {
  constructor(
    private readonly btcBuyTransactionService: BtcBuyTransactionService,
  ) {}
  logger = new Logger(TransactionBtcBuyController.name);

  @Post('btc/buy')
  @UseGuards(JwtAuthGuard)
  async buyBtc(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.btcBuyTransactionService.buyBtc(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a buy of ${value} BTC with R$${transaction.brl_amount} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }
}
