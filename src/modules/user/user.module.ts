import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
