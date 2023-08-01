import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constant';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { LiveUserRole } from 'src/live-user-role/entities/live-user-role.entity';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@WebSocketGateway(8081, { namespace: 'meeting', cors: true })
export class MeetingGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly meetingService: MeetingService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    @Inject(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
    @Inject(LiveUserRole.name)
    private readonly liveUserRoleModel: ReturnModelType<typeof LiveUserRole>,
    @Inject(Message.name)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}
  @SubscribeMessage('createMeeting')
  async create(
    @MessageBody() createMeetingDto: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = createMeetingDto;
    await client.join(roomId);
    return {
      room: createMeetingDto.roomId,
    };
  }
  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() messageBody: any) {
    const { text, roomId, user } = messageBody;
    const exist = await this.userModel.findById(user);
    if (!exist) {
      throw new UnauthorizedException('用户不存在');
    }
    const createmessageDto: CreateMessageDto = {
      text,
      type: 1,
      user,
      liveRoom: roomId,
    };
    const currentRole = await this.liveUserRoleModel.findOne({
      user,
      liveRoom: roomId,
    });
    const newMessage = await this.messageModel.create(createmessageDto);
    const message = {
      text: newMessage.text,
      username: exist.username,
      userId: exist._id,
      role: currentRole.role,
    };
    this.server.to(roomId).emit('message', message);
    return message;
  }
}
