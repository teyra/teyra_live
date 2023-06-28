import { ApiProperty } from '@nestjs/swagger';
import { Ref, prop } from '@typegoose/typegoose';
import { Liveroom } from 'src/liveroom/entities/liveroom.entity';
import { User } from 'src/user/entities/user.entity';
export class CreateLiveUserRoleDto {
    @prop({ ref: 'Liveroom' })
    @ApiProperty({ description: '直播间' })
    liveRoom: Ref<Liveroom>;
    @prop({ ref: 'User' })
    @ApiProperty({ description: '当前人' })
    user: Ref<User>;
}
