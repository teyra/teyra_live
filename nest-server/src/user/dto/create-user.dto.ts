import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ description: '账号' })
  username: string;
  @ApiProperty({ description: '手机号码' })
  mobile: string;
}
