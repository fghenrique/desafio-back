import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTransactionService } from '../services/create-transaction.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/modules/account/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';

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

    return { ok: true, transaction };
  }
}
