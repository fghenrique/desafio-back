import { Module } from '@nestjs/common';
import { TransactionModule } from '../transactions/transaction.module';
import { GetMetricsVolumeService } from './services/get-metrics-volume.service';
import { MetricsVolumeController } from './controllers/metrics-volume.controller';

@Module({
  controllers: [MetricsVolumeController],
  imports: [TransactionModule],
  providers: [GetMetricsVolumeService],
})
export class MetricsModule {}
