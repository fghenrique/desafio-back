import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { FindOneUserOptions } from '../interfaces/find-one-user-options.interface';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class FindOneUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(options: FindOneUserOptions): Promise<User> {
    return await this.userRepository.findOne(options);
  }
}
