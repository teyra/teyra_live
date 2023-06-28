import { ApiProperty } from '@nestjs/swagger';
import { Ref, prop } from '@typegoose/typegoose';
import { User } from 'src/user/entities/user.entity';
export class CreateLiveroomDto {
  @prop({ default: '' })
  @ApiProperty({ description: '直播间标题' })
  title: string;
  @prop({ default: '' })
  @ApiProperty({ description: '直播间描述' })
  description: string;
  @prop({ ref: 'User' })
  @ApiProperty({ description: '创建者' })
  user: Ref<User>;
}
