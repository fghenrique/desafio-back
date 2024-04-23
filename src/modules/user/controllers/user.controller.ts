import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import ApiError from '@/common/error/entities/api-error.entity';
import { Account } from '@/modules/account/account.entity';
import { CreateAccountService } from '@/modules/account/services/create-account.service';
import { CreateUserService } from '../services/create-user.service';
import { FindOneUserService } from '../services/find-one-user.service';
import { User } from '../user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly createAccountService: CreateAccountService,
  ) {}
  logger = new Logger(UserController.name);

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailAlreadyInUse = await this.findOneUserService.findOne({
      key: 'email',
      value: createUserDto.email,
    });

    if (emailAlreadyInUse)
      throw new ApiError('email-already-in-use', 'Email já está em uso', 400);

    const user = new User();
    Object.assign(user, createUserDto);

    const createdUserAccount = await this.createAccountService.createAccount(
      new Account(),
    );

    user.account = createdUserAccount;
    user.account_id = createdUserAccount.id;

    const createdUser = await this.createUserService.createUser(
      user,
      createUserDto.password,
    );

    this.logger.log(
      `User ${createdUser.id} created with email ${createdUser.email}, it holds the account id ${createdUserAccount.id}`,
    );

    // here we return only the accountId inside account because it's the only info that make sense to be returned
    return {
      ok: true,
      user: createdUser,
    };
  }
}
