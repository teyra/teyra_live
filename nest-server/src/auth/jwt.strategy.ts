import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constant';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';
import { ReturnModelType } from '@typegoose/typegoose';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly redisService: RedisService,
    @Inject(User.name) private userModel: ReturnModelType<typeof User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtConstants.secret,
    } as StrategyOptions);
  }
  async validate(req: Request, payload: any) {
    const currentToken = req.headers.authorization.split('Bearer ')[1] || '';
    const existRedisToken = await this.redisService.get('user-token' + payload.sub);
    if (!existRedisToken) {
      throw new UnauthorizedException('token过期');
    }
    if (String(currentToken) !== String(existRedisToken)) {
      throw new UnauthorizedException('token过期');
    }
    const user = await this.userModel.findById(payload.sub);
    return user;
  }
}
