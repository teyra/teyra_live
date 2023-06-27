import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
    @ApiProperty({ description: '账号' })
    username: string
    @ApiProperty({ description: '手机号码' })
    mobile: string
    @ApiProperty({ description: '密码' })
    password: string
    @ApiProperty({ description: '验证码' })
    sms: string
}
