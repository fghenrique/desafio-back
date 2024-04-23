import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindOneUserOptions } from '../interfaces/find-one-user-options.interface';
import ApiError from '@/common/error/entities/api-error.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    await this.userRepository.save({
      ...user,
      password_hash: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10)),
    });
    const dbUser = await this.findOne({ key: 'email', value: user.email });
    return dbUser;
  }

  async findOne(options: FindOneUserOptions): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('users');

    if (options.relations) {
      options.relations.forEach((relation) => {
        qb.leftJoinAndSelect(`users.${relation}`, relation);
      });
    }

    if (options.withPasswordHash) qb.addSelect('users.password_hash');

    if (options.key && options.value)
      qb.where(`users.${options.key} = :value`, { value: options.value });

    const user = await qb.getOne();
    return user;
  }

  async updateUserPassword(id: string, password_hash: string) {
    try {
      const user = await this.findOne({ key: 'id', value: id });
      return await this.userRepository.save({ ...user, password_hash });
    } catch (error) {}
    throw new ApiError(
      'error-updating-user-password',
      'Erro ao atualizar a senha, contate o suporte',
      500,
    );
  }
}
