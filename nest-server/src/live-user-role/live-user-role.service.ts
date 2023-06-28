import { Injectable } from '@nestjs/common';
import { CreateLiveUserRoleDto } from './dto/create-live-user-role.dto';
import { UpdateLiveUserRoleDto } from './dto/update-live-user-role.dto';

@Injectable()
export class LiveUserRoleService {
  create(createLiveUserRoleDto: CreateLiveUserRoleDto) {
    return 'This action adds a new liveUserRole';
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
