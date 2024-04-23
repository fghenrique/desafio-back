import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/user/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthMailService } from './mail/auth.mail.service';
import { AuthHelper } from '../helpers/auth.helper';
import ApiError from '@/common/error/entities/api-error.entity';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authMailService: AuthMailService,
    private authHelper: AuthHelper,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.userService.findOne({
      key: 'email',
      value: username,
      withPasswordHash: true,
    });
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    return null;
  }

  async getLoginResponse(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne({
      key: 'email',
      value: email,
    });
    if (!user)
      throw new ApiError('user-not-found', 'Usuário não encontrado', 404);
    const token = await this.authHelper.generateResetPasswordToken(email);
    await this.authMailService.sendResetPasswordEmail(user, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const isTokenValid = await this.jwtService.verify(resetPasswordDto.token);
    if (!isTokenValid)
      throw new ApiError(
        'invalid-token',
        'Token associado ao link é inválido',
        400,
      );
    if (!(resetPasswordDto.password === resetPasswordDto.confim_password))
      throw new ApiError('passwords-not-match', 'As senhas não conferem', 400);
    const { email } = this.jwtService.decode(resetPasswordDto.token) as {
      email: string;
    };
    const user = await this.userService.findOne({
      key: 'email',
      value: email,
    });
    if (!user)
      throw new ApiError('user-not-found', 'Usuário não encontrado', 404);
    const password_hash = await bcrypt.hash(
      resetPasswordDto.password,
      bcrypt.genSaltSync(10),
    );
    await this.userService.updateUserPassword(user.id, password_hash);
  }
}
