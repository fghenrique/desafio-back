import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/common/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';
import { WithdrawTransactionService } from '../services/withdraw-transaction.service';

@Controller('transaction')
export class TransactionWithdrawController {
  constructor(
    private readonly withdrawTransactionService: WithdrawTransactionService,
  ) {}
  logger = new Logger(TransactionWithdrawController.name);

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.withdrawTransactionService.withdraw(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a withdraw of R$${value} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }
}
