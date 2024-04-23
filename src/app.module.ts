import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transactions/transaction.module';
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
      synchronize: process.env.MODE === 'dev' ? true : false,
      logging: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
