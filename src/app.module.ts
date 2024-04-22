import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from 'dotenv';
config();

@Module({
  imports: [
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
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
