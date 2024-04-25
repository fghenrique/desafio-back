import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/common/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';
import { BtcSellTransactionService } from '../services/btc-sell-transaction.service';

@Controller('transaction')
export class TransactionBtcSellController {
  constructor(
    private readonly btcSellTransactionService: BtcSellTransactionService,
  ) {}
  logger = new Logger(TransactionBtcSellController.name);

  @Post('btc/sell')
  @UseGuards(JwtAuthGuard)
  async sellBtc(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.btcSellTransactionService.sellBtc(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a sell of ${value} BTC earning R$${transaction.brl_amount} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }
}
