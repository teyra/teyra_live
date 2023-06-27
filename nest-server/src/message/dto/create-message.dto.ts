import { ApiProperty } from '@nestjs/swagger';
export enum MESSAGE_TYPE {
  TEXT = 1, //文本
  IMAGE = 2, //图片
  VIDEO = 3, //视频
  REFERENCE = 4, //引用消息
}
export class CreateMessageDto {
  @ApiProperty({ description: '文本' })
  text: string;
  @ApiProperty({ description: '文本' })
  type: MESSAGE_TYPE;
  @ApiProperty({ description: '图片' })
  image: string;
  @ApiProperty({ description: '视频' })
  video: string;
  @ApiProperty({ description: '引用消息' })
  reference: string;
  @ApiProperty({ description: '引用消息文本' })
  reference_text: string;
  @ApiProperty({ description: '发送人' })
  user: string;
  @ApiProperty({ description: '聊天群' })
  group: string;
}
