import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetMetricsVolumeService } from '../services/get-metrics-volume.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly getMetricsVolumeService: GetMetricsVolumeService,
  ) {}

  @Get('volume')
  @UseGuards(JwtAuthGuard)
  async getVolume() {
    const volume = await this.getMetricsVolumeService.getVolume();
    return { ok: true, volume };
  }
}
