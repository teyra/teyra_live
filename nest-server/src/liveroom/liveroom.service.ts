import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateLiveroomDto } from './dto/create-liveroom.dto';
import { UpdateLiveroomDto } from './dto/update-liveroom.dto';
import { User } from 'src/user/entities/user.entity';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Liveroom } from './entities/liveroom.entity';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class LiveroomService {
  constructor(
    @Inject(Liveroom.name)
    private liveRoomModel: ReturnModelType<typeof Liveroom>,
    private readonly redisService: RedisService,
  ) {}
  async create(createLiveroomDto: CreateLiveroomDto, user: DocumentType<User>) {
    const { title, description } = createLiveroomDto;
    const liveroom = await this.liveRoomModel.create({
      title,
      description,
      user,
    });
    await this.redisService.set('liveroom-status' + liveroom.id, 2);
  }

  async getLiveStatus(id: string) {
    const status = await this.redisService.get('liveroom-status' + id);
    return status;
  }

  async findOne(id: string) {
    const liveroom = await this.liveRoomModel.findById(id);
    if (liveroom) {
      return liveroom;
    } else {
      throw new HttpException('直播间不存在', 404);
    }
  }
  async findMy(user: DocumentType<User>) {
    const exists = await this.liveRoomModel.findOne({ user });
    if (exists) {
      return exists;
    } else {
      const createDto: CreateLiveroomDto = {
        user: user._id,
        title: user.username + '的直播间',
        description: '',
      };
      return await this.liveRoomModel.create(createDto);
    }
  }
  async update(id: string, updateLiveroomDto: UpdateLiveroomDto) {
    const currentRoom = await this.liveRoomModel.findById(id);
    const { title } = updateLiveroomDto;
    if (currentRoom) {
      currentRoom.title = title;
      currentRoom.save();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} liveroom`;
  }
}
