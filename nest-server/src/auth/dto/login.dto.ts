import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
    @ApiProperty({ description: '账号' })
    username: string
    @ApiProperty({ description: '密码' })
    password: string
}
