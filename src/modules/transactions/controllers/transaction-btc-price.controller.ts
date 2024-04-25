import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { getBtcPrice } from '@/common/btc/get-price';

@Controller('transaction')
export class TransactionBtcPriceController {
  @Get('btc/price')
  @UseGuards(JwtAuthGuard)
  async getPrice() {
    const price = await getBtcPrice();
    return { ok: true, price };
  }
}
