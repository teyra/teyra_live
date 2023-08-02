import { ApiProperty } from '@nestjs/swagger';
import { Ref, prop } from '@typegoose/typegoose';
import { User } from 'src/user/entities/user.entity';

export class Meeting {
  @prop({ default: 0 })
  @ApiProperty({ description: '会议号' })
  conferenceNumber: number;
  @prop({ default: '' })
  @ApiProperty({ description: '会议标题' })
  title: string;
  @prop({ default: '' })
  @ApiProperty({ description: '会议描述' })
  description: string;
  @prop({ ref: 'User' })
  @ApiProperty({ description: '创建者' })
  user: Ref<User>;
}
