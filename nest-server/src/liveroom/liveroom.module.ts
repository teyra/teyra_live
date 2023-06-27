import { Module } from '@nestjs/common';
import { LiveroomService } from './liveroom.service';
import { LiveroomController } from './liveroom.controller';
import { LiveroomGateway } from './liveroom.gateway';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [LiveroomController],
  providers: [LiveroomService, LiveroomGateway, RedisService],
})
export class LiveroomModule {}
