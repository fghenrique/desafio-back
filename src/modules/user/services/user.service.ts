import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { FindOneUserOptions } from '../interfaces/find-one-user-options.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async findOne(options: FindOneUserOptions): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async updateUserPassword(
    userId: string,
    passwordHash: string,
  ): Promise<User> {
    return await this.userRepository.updateUserPassword(userId, passwordHash);
  }
}
