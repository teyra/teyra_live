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
import { LiveUserRoleService } from 'src/live-user-role/live-user-role.service';
import { ROOM_TYPE } from 'src/live-user-role/dto/create-live-user-role.dto';

@WebSocketGateway(8081, { namespace: 'meeting', cors: true })
export class MeetingGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly meetingService: MeetingService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly liveUserRoleService: LiveUserRoleService,
    @Inject(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
    @Inject(LiveUserRole.name)
    private readonly liveUserRoleModel: ReturnModelType<typeof LiveUserRole>,
    @Inject(Message.name)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}
  async handleConnection(socket: Socket) {
    try {
      const currentToken = socket.handshake.auth.token;
      const tokenVerify = await this.jwtService.verifyAsync(currentToken, {
        secret: jwtConstants.secret,
      });
      const existRedisToken = await this.redisService.get(
        'user-token' + tokenVerify.sub,
      );
      if (!existRedisToken) {
        throw new UnauthorizedException('token过期');
      }
      if (String(currentToken) !== String(existRedisToken)) {
        throw new UnauthorizedException('token过期');
      }
    } catch (e) {}
  }
  @SubscribeMessage('joinMeeting')
  async create(
    @MessageBody() createMeetingDto: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = createMeetingDto;
    await client.join(roomId);
    await this.liveUserRoleService.create({
      user,
      liveRoom: roomId,
      type:ROOM_TYPE.MEETING
    });
    const currentUser = await this.userModel.findById(user);
    await this.server.to(roomId).emit('memberJoined', {
      username: currentUser.username,
    });
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
