<template>
  <div class="flex justify-center items-center pull-container">
    <div class="left-container flex-column">
      <div class="video-container">
        <video
          ref="localVideoRef"
          style="width: 1000px; height: 650px"
          autoplay
          webkit-playsinline="true"
          playsinline
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
        ></video>
      </div>
      <div class="setting-bar opc-9 p-10 bg-white">
        <div class="left-content">
          <img src="@/assets/image/avatar.jpg" class="w-65 h-65 round-50" alt="" />
        </div>
        <div class="right-content"></div>
      </div>
    </div>
    <div class="right-container flex-column">
      <div class="danmu-interactive p-10 round-5 w-350 bg-white">
        <div class="c-black fs-16">弹幕互动区</div>
        <div class="content-list"></div>
        <div class="send-container">
          <el-input
            v-model="message"
            placeholder="和主播聊聊吧~"
            class="small-input"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-button type="primary">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { io } from 'socket.io-client'
let message = ref('')
let localVideoRef: any = ref<HTMLVideoElement>()
let peerConnection = reactive({} as RTCPeerConnection)
let websocket = ref()
onMounted(() => {
  websocket.value = io('ws://localhost:8080')
  websocket.value.on('connect', () => {
    console.log('连接成功')
  })
  websocket.value.emit('joinRoom', '123')
  websocket.value.on('create', (room: any) => {
    console.log('创建或加入房间' + room)
  })
  let serverConfig = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  }
  websocket.value.on('offer', async (offer: any) => {
    console.log('get offer' + offer)
    peerConnection = new RTCPeerConnection(serverConfig)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    websocket.value.emit('offer', answer,'123')
    peerConnection.onicecandidate = (event) => {
      console.log('I got remote icecandidate info')
      let icecandidate = event.candidate
      // console.log(event)
      if (icecandidate) {
        websocket.value.emit('ice', icecandidate,'123')
      }
    }
    peerConnection.addEventListener('connectionstatechange', (event) => {
      if (peerConnection.connectionState === 'connected') {
        // Peers connected!
      }
    })
    peerConnection.addEventListener('track', async (event) => {
      console.log(event)
    })
    peerConnection.ontrack = (event) => {
      console.log(event + 'ontrack')
      // localVideoRef.value.srcObject = event.streams[0]
    }
  })
  websocket.value.on('ice', (candidate: any) => {
    console.log(candidate + 'candidate')
    if (candidate) {
      try {
        peerConnection.addIceCandidate(candidate)
      } catch (error) {
        console.log(error)
      }
    }
  })
})
// const videoCall = async () => {
//   await iceListenner()
// }
const iceListenner = () => {}
</script>
<style scoped lang="scss">
.pull-container {
  height: 100vh;
  min-height: 680px;
  min-width: 1320px;
  width: 100vw;
  background-image: url('@/assets/image/pull_bg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  .left-container {
    .video-container {
      position: relative;
      display: flex;
      background: #000000;
    }

    .setting-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .left-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
      .right-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }
  .right-container {
    opacity: 0.9;
    justify-content: space-between;
    height: 735px;
    margin-left: 10px;
    .danmu-interactive {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .send-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
      }
    }
  }
}
</style>
