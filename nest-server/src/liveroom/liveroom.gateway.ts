import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { LiveroomMessageDto } from './dto/liveroom-message.dto';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
@WebSocketGateway(81, { cors: true })
export class LiveroomGateway {
  @WebSocketServer() server: Server;
  constructor(
    private readonly redisService: RedisService,
    @Inject(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
    @Inject(Message.name)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}
  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() createMessageDto: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = createMessageDto;
    client.join(roomId);
    this.server.to(roomId).emit('otherJoined');
    // client.to(roomId).emit('otherJoined');
    return {
      room: createMessageDto.roomId,
    };
    // client.emit('ownerCreate', { room: 12323 });
    // this.server.emit('ownerCreate', { room: 12323 });
  }
  @SubscribeMessage('liveStreamStatus')
  watchLiveStreamStatus(@MessageBody() messageBody: any) {
    const { liveStreamStatus, roomId } = messageBody;
    this.redisService.set('liveroom-status' + roomId, liveStreamStatus);
    this.server.emit('liveStreamStatus', liveStreamStatus);
  }
  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() messageBody: LiveroomMessageDto) {
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
    const newMessage = await this.messageModel.create(createmessageDto);
    const message = {
      text: newMessage.text,
      username: exist.username,
      roleName:1
    };
    this.server.to(roomId).emit('message', message);
  }
}
