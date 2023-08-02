import { ApiProperty } from '@nestjs/swagger';
import { Ref, prop } from '@typegoose/typegoose';
import { Liveroom } from 'src/liveroom/entities/liveroom.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { User } from 'src/user/entities/user.entity';
export enum ROOM_TYPE {
  LIVE = 1, //直播
  MEETING = 2, //会议
}
export class CreateLiveUserRoleDto {
  @prop({ ref: 'Liveroom' })
  @ApiProperty({ description: '直播间' })
  liveRoom: Ref<Liveroom | Meeting>;
  @prop({ ref: 'User' })
  @ApiProperty({ description: '当前人' })
  user: Ref<User>;
  @prop({ default: ROOM_TYPE.LIVE, enum: ROOM_TYPE })
  type: ROOM_TYPE;
}
