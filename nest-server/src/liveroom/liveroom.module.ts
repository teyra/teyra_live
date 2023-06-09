import { Module } from '@nestjs/common';
import { LiveroomService } from './liveroom.service';
import { LiveroomController } from './liveroom.controller';
import { LiveroomGateway } from './liveroom.gateway';
import { RedisService } from 'src/redis/redis.service';
import { LiveUserRoleService } from 'src/live-user-role/live-user-role.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LiveroomController],
  providers: [LiveroomService, LiveroomGateway, RedisService, LiveUserRoleService, JwtService],
})
export class LiveroomModule { }
