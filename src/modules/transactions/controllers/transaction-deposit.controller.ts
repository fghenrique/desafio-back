import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ValueDto } from '@/common/dtos/value.dto';
import { User } from '@/modules/user/user.entity';
import { Request } from 'express';
import { DepositTransactionService } from '../services/deposit-transaction.service';

@Controller('transaction')
export class TransactionDepositController {
  constructor(
    private readonly depositTransactionService: DepositTransactionService,
  ) {}
  logger = new Logger(TransactionDepositController.name);

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Req() req: Request, @Body() { value }: ValueDto) {
    const user = req.user as User;

    const transaction = await this.depositTransactionService.deposit(
      user,
      user.account,
      value,
    );

    this.logger.log(
      `User ${user.id} made a deposit of R$${value} creating the transaction ${transaction.id}`,
    );
    return { ok: true, transaction };
  }
}
