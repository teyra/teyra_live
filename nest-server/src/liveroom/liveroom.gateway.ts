import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway(81, { cors: true })
export class LiveroomGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly redisService: RedisService) {}
  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() createMessageDto: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = createMessageDto;
    client.join(roomId);
    console.log(client);
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
}
