import { ApiProperty } from '@nestjs/swagger';
export enum CHAT_TYPE {
  SINGLE = 1, //单聊
  GROUP = 2, //群聊
}
export class CreateGroupDto {
  @ApiProperty({ description: '群昵称', default: '一群' })
  name: string;
  @ApiProperty({ description: '群类型', default: 1 })
  type: CHAT_TYPE;
  @ApiProperty({ description: '群成员' })
  members: string[];
}
