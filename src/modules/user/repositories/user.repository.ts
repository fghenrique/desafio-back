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
    const newUser = await this.userRepository.save({
      ...user,
      password_hash: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10)),
    });
    return newUser;
  }

  async findOne(options: FindOneUserOptions): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user');

    if (options.relations) {
      options.relations.forEach((relation) => {
        qb.leftJoinAndSelect(`user.${relation}`, relation);
      });
    }

    if (options.withPasswordHash) qb.addSelect('user.password_hash');

    if (options.key && options.value)
      qb.where(`user.${options.key} = :value`, { value: options.value });

    const user = await qb.getOne();
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('user.id = :id', { id });
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
