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
  let roomId = ''
  console.log('a user connected')
  console.log(socket.id)
  //创建房间
  socket.on('createRoom', (data) => {
    roomId = data.roomId //房间号
    let myRoom = io.sockets.adapter.rooms.get(roomId)
    if (!myRoom) {
      socket.join(roomId) //加入房间
      socket.emit('ownerCreate', roomId, socket.id)
    } else {
      socket.emit('errorMake', roomId, socket.id)
    }
  })
  //加入房间
  socket.on('joinRoom', (data) => {
    roomId = data.roomId
    let myRoom = io.sockets.adapter.rooms.get(roomId)
    if (!myRoom) {
      socket.emit('noRoom', roomId, socket.id)
    } else {
      socket.join(roomId) //加入房间
      socket.emit('userJoined', roomId, socket.id)
      socket.to(roomId).emit(`otherJoined`, roomId, socket.id) //给房间里广播
    }
  })
  //监听群聊信息
  // socket.on(`message`, (data, room, name, socketId) => {
  //   //广播群聊
  //   console.log('getMsg-------', data.type, room)
  //   socket.to(room).emit(`message`, room, { msg: data, name: name, socketId }) //给房间里广播
  // })
  socket.on('liveStreamStatus', (status: number, room: string, socketId: string) => {
    socket.to(room).emit('liveStreamStatus', status, socketId)
  })
  //监听离开房间
  socket.on('leave', (data) => {
    let { roomId, name, socketId } = data
    console.log(roomId, name)
    socket.emit('leaved', roomId)
    socket.to(roomId).emit(`otherleaved`, roomId, name, socketId) //给房间里广播
  })
  // socket.on('joinRoom', (room: string) => {
  //   socket.join(room)
  //   socket.emit('create', room)
  // })
  // socket.on('liveStreamStatus', (status: number, room: string) => {
  //   socket.to(room).emit('liveStreamStatus', status)
  // })
  socket.on('offer', (data: RTCSessionDescriptionInit, room: string, socketId: string) => {
    socket.to(room).emit('offer', data, roomId, socketId)
  })
  socket.on('ice', (data: RTCIceCandidate, room: string, socketId: string) => {
    socket.to(room).emit('ice', data, roomId, socketId)
  })
})
httpServer.listen(8080)
console.log('http://lcoalhost/8080')
