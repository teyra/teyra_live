import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Server } from 'socket.io';
@WebSocketGateway(81, {
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly socketService: SocketService) {}
  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() createSocketDto: CreateSocketDto) {
    console.log(createSocketDto);
    return {
      room: 12323,
    };
    // this.server.emit('ownerCreate', { room: 12323 });
    // return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage('liveStreamStatus')
  watchLiveStreamStatus(@MessageBody() messageBody: any) {
    const { liveStreamStatus, roomId } = messageBody;
    this.server.emit('liveStreamStatus', liveStreamStatus);
  }

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    return this.socketService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return this.socketService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    return this.socketService.remove(id);
  }
}
