import { Inject, Injectable } from '@nestjs/common';
import {
  CreateLiveUserRoleDto,
  ROOM_TYPE,
} from './dto/create-live-user-role.dto';
import { UpdateLiveUserRoleDto } from './dto/update-live-user-role.dto';
import { Liveroom } from 'src/liveroom/entities/liveroom.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from 'src/user/entities/user.entity';
import { LiveUserRole, ROLE_TYPE } from './entities/live-user-role.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';

@Injectable()
export class LiveUserRoleService {
  constructor(
    @Inject(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
    @Inject(Liveroom.name)
    private readonly liveroomModel: ReturnModelType<typeof Liveroom>,
    @Inject(Meeting.name)
    private readonly meetingModel: ReturnModelType<typeof Meeting>,
    @Inject(LiveUserRole.name)
    private readonly liveUserRoleModel: ReturnModelType<typeof LiveUserRole>,
  ) {}
  async create(createLiveUserRoleDto: CreateLiveUserRoleDto) {
    const { user, liveRoom, type } = createLiveUserRoleDto;
    const exist = await this.liveUserRoleModel.findOne({ user, liveRoom });
    if (!exist && user && liveRoom) {
      let currentRoom;
      if (type === ROOM_TYPE.LIVE) {
        currentRoom = await this.liveroomModel.findById(liveRoom);
      } else if (type === ROOM_TYPE.MEETING) {
        currentRoom = await this.meetingModel.findById(liveRoom);
      }
      await this.liveUserRoleModel.create({
        user,
        liveRoom,
        role:
          String(currentRoom.user) === String(user)
            ? ROLE_TYPE.HOST
            : ROLE_TYPE.VISITOR,
      });
    }
  }
  findAll() {
    return `This action returns all liveUserRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liveUserRole`;
  }

  update(id: number, updateLiveUserRoleDto: UpdateLiveUserRoleDto) {
    return `This action updates a #${id} liveUserRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveUserRole`;
  }
}
