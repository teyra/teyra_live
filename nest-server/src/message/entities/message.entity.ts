import { ApiProperty } from '@nestjs/swagger';
import { prop, Ref } from '@typegoose/typegoose';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
export enum MESSAGE_TYPE {
  TEXT = 1, //文本
  IMAGE = 2, //图片
  VIDEO = 3, //视频
  REFERENCE = 4, //引用消息
}
export class Message {
  @prop({ default: '' })
  @ApiProperty({ description: '文本' })
  text: string;
  @prop({ default: 1, enum: MESSAGE_TYPE })
  @ApiProperty({ description: '文本' })
  type: MESSAGE_TYPE;
  @prop({ default: '' })
  @ApiProperty({ description: '图片' })
  image: string;
  @prop({ default: '' })
  @ApiProperty({ description: '视频' })
  video: string;
  @prop({ ref: 'Message' })
  @ApiProperty({ description: '引用消息' })
  reference: Ref<Message>;
  @prop({ default: '' })
  @ApiProperty({ description: '引用消息文本' })
  reference_text: string;
  @prop({ ref: 'User' })
  @ApiProperty({ description: '发送人' })
  user: Ref<User>;
  @prop({ ref: 'Group' })
  @ApiProperty({ description: '聊天群' })
  group: Ref<Group>;
}
