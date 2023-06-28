import { ApiProperty } from '@nestjs/swagger';
import { Ref, prop } from '@typegoose/typegoose';
import { User } from 'src/user/entities/user.entity';
export enum ROLE_TYPE {
  VISITOR = 1, //游客
  FANS = 2, //粉丝
  MANAGER = 3, //管理员
  HOST = 4, //房主
}
export class LiveUserRole {
  @prop({ default: 1, enum: ROLE_TYPE })
  @ApiProperty({ description: '角色' })
  role: ROLE_TYPE;
  @prop({ default: '' })
  @ApiProperty({ description: '直播间描述' })
  description: string;
  @prop({ ref: 'User' })
  @ApiProperty({ description: '当前人' })
  user: Ref<User>;
}
