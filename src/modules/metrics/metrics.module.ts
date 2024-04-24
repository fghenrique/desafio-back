import { Module } from '@nestjs/common';
import { MetricsController } from './controllers/metrics.controller';
import { TransactionModule } from '../transactions/transaction.module';
import { GetMetricsVolumeService } from './services/get-metrics-volume.service';

@Module({
  controllers: [MetricsController],
  imports: [TransactionModule],
  providers: [GetMetricsVolumeService],
})
export class MetricsModule {}
