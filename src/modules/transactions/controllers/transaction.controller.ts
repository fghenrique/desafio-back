import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionService } from '../services/create-transaction.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/common/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';
import { getBtcPrice } from '@/common/btc/get-price';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
  ) {}
  logger = new Logger(TransactionController.name);

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.createTransactionService.deposit(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a deposit of R$${value} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.createTransactionService.withdraw(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a withdraw of R$${value} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }

  @Post('btc/buy')
  @UseGuards(JwtAuthGuard)
  async buyBtc(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.createTransactionService.buyBtc(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a buy of ${value} BTC with R$${transaction.brl_amount} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }

  @Post('btc/sell')
  @UseGuards(JwtAuthGuard)
  async sellBtc(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.createTransactionService.sellBtc(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a sell of ${value} BTC earning R$${transaction.brl_amount} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }

  @Get('btc/price')
  @UseGuards(JwtAuthGuard)
  async getPrice() {
    const price = await getBtcPrice();
    return { ok: true, price };
  }
}
