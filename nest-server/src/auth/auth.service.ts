import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compareSync } from 'bcryptjs';
import { ReturnModelType } from '@typegoose/typegoose';
import { RedisService } from 'src/redis/redis.service';
export enum CODE_STATUS {
  INIT = 1, //初始化二维码
  SCAN = 2, //扫码成功
  FINISH = 3, //扫码确认
  CANCEL = 4, //扫码取消
  EXPIRE = 5, //二维码过期
}
@Injectable()
export class AuthService {
  constructor(
    @Inject(User.name)
    private userModel: ReturnModelType<typeof User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      const newUser = await this.userModel.create({ username, password });
      const payload = { sub: newUser._id };
      const token = this.jwtService.sign(payload);
      this.redisService.set('user-token' + String(newUser._id), token);
      return {
        token,
      };
    } else {
      let valid = compareSync(password, user.password);
      if (!valid) {
        throw new UnauthorizedException('密码不正确');
      }
      const payload = { sub: user._id };
      const token = this.jwtService.sign(payload);
      this.redisService.set('user-token' + String(user._id), token);
      return {
        token,
      };
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, mobile, password, sms } = registerDto;
    if (sms && sms === '123456') {
      const user = await this.userModel.findOne({ mobile });
      if (user) {
        throw new UnauthorizedException('用户已注册');
      } else {
        return await this.userModel.create({ username, mobile, password });
      }
    } else {
      throw new UnauthorizedException('验证码不正确');
    }
  }
  async logOut(user) {
    this.redisService.del('user-token' + user._id);
    return '退出成功';
  }
}
