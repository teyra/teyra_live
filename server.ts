import * as express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket: Socket) => {
  console.log('连接成功')
  // 创建房间
  socket.on('joinRoom', (room) => {
    socket.join(room)
    socket.emit('create', room)
  })
  socket.on('offer', (data, room) => {
    socket.to(room).emit('offer', data)
  })
  socket.on('ice', (data, room) => {
    console.log(data, 'ice')
    socket.to(room).emit('ice', data)
  })
})
httpServer.listen(8080)
console.log('http://lcoalhost/8080')
