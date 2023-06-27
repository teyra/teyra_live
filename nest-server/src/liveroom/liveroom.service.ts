import { Inject, Injectable } from '@nestjs/common';
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
  ) { }
  async create(createLiveroomDto: CreateLiveroomDto, user: DocumentType<User>) {
    const { name, description } = createLiveroomDto;
    const liveroom = await this.liveRoomModel.create({
      name,
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
    return liveroom;
  }
  async findMy(user: DocumentType<User>) {
    // console.log(user);
    // const myLiveroom = await this.liveRoomModel.findOne({ user })
    // console.log(myLiveroom);
    // return myLiveroom;
  }
  update(id: number, updateLiveroomDto: UpdateLiveroomDto) {
    return `This action updates a #${id} liveroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveroom`;
  }
}
