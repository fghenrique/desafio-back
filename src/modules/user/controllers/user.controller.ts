import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';
import ApiError from '@/common/error/entities/api-error.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const emailAlreadyInUse = await this.userService.findOne({
      key: 'email',
      value: createUserDto.email,
    });

    if (emailAlreadyInUse)
      throw new ApiError('email-already-in-use', 'Email já está em uso', 400);

    const user = await this.userService.createUser(createUserDto);
    return { ok: true, user };
  }
}
