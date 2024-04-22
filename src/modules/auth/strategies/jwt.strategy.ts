import { UserService } from '@/modules/user/services/user.service';
import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: User) {
    const user: User = await this.userService.findOne({
      key: 'id',
      value: payload.id,
    });
    return user;
  }
}
