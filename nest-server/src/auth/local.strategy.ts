import { PassportStrategy } from '@nestjs/passport';
import { Strategy, IStrategyOptions } from 'passport-local';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(User.name) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  async validate(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      throw new HttpException('用户不存在', 201);
    }
    let valid = compareSync(password, user.password);
    if (!valid) {
      throw new HttpException('密码不正确', 201);
    }
    return user;
  }
}
