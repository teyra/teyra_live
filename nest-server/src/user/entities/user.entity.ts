import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
export class User {
  @prop()
  @ApiProperty({ description: '账号' })
  username: string;
  @prop()
  @ApiProperty({ description: '手机号码' })
  mobile: string;
  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return val && hashSync(val, 10);
    },
  })
  @ApiProperty({ description: '密码' })
  password: string;
}
