import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MeetingService {
  constructor(
    @Inject(Meeting.name)
    private meetingModel: ReturnModelType<typeof Meeting>,
    private readonly redisService: RedisService,
  ) {}
  async create(user: DocumentType<User>) {
    let code = '' + (parseInt(String(Math.random() * 1000000)) + 1000000);
    code = code.substring(1, 7);
    const createDto: CreateMeetingDto = {
      user,
      conferenceNumber: Number(code),
    };
    return await this.meetingModel.create(createDto);
  }
  async findOne(conferenceNumber: number) {
    const meeting = await this.meetingModel.findOne({ conferenceNumber });
    if (meeting) {
      return meeting;
    } else {
      throw new HttpException('会议号不存在', 404);
    }
  }
}
