import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import ApiError from '@/common/error/entities/api-error.entity';
import { Account } from '@/modules/account/account.entity';
import { CreateAccountService } from '@/modules/account/services/create-account.service';
import { CreateUserService } from '../services/create-user.service';
import { FindOneUserService } from '../services/find-one-user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly createAccountService: CreateAccountService,
  ) {}
  logger = new Logger();

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailAlreadyInUse = await this.findOneUserService.findOne({
      key: 'email',
      value: createUserDto.email,
    });

    if (emailAlreadyInUse)
      throw new ApiError('email-already-in-use', 'Email já está em uso', 400);

    const user = await this.createUserService.createUser(createUserDto);
    const userAccount = new Account();

    userAccount.user = user;
    userAccount.user_id = user.id;
    const createdUserAccount =
      await this.createAccountService.createAccount(userAccount);

    this.logger.log(
      `User ${user.id} created with email ${user.email}, it has the account id ${createdUserAccount.id}`,
    );

    // here we return only the accountId inside account because it's the only info that make sense to be returned
    return {
      ok: true,
      user: { ...user, account: { id: createdUserAccount.id } },
    };
  }
}
