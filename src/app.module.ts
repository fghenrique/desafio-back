import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { MetricsModule } from './modules/metrics/metrics.module';
config();

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      cache: {
        type: 'redis',
        options: {
          socket: {
            host: process.env.REDIS_URL,
            port: process.env.REDIS_PORT,
          },
        },
      },
    }),
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
    MetricsModule,
  ],
})
export class AppModule {}
