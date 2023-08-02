import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingGateway } from './meeting.gateway';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { MeetingController } from './meeting.controller';
import { LiveUserRoleService } from 'src/live-user-role/live-user-role.service';

@Module({
  providers: [MeetingGateway, MeetingService, RedisService, JwtService,LiveUserRoleService],
  controllers: [MeetingController],
})
export class MeetingModule {}
