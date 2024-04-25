import { User } from '../user.entity';
import { Injectable } from '@nestjs/common';
import { FindOneUserOptions } from '../interfaces/find-one-user-options.interface';

@Injectable()
export abstract class UserRepository {
  abstract create(user: User, password: string): Promise<User>;

  abstract findOne(options: FindOneUserOptions): Promise<User>;
}
