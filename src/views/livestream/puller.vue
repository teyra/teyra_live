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
let message = ref('')
let localVideoRef: any = ref<HTMLVideoElement>()
let localPeerConnection = reactive({} as RTCPeerConnection)
let remotePeerConnection = reactive({} as RTCPeerConnection)
onMounted(() => {
  videoCall()
})
const videoCall = async () => {
  await initPeerConnection()
  await iceListenner()
  await createConnect()
}
const initPeerConnection = () => {
  let serverConfig = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  }
  localPeerConnection = new RTCPeerConnection(serverConfig)
  remotePeerConnection = new RTCPeerConnection(serverConfig)
}
const createConnect = async () => {
  const localSdp = await localPeerConnection.createOffer()
  localPeerConnection.setLocalDescription(localSdp)
  remotePeerConnection.setRemoteDescription(localSdp)
  const remoteSdp = await remotePeerConnection.createAnswer()
  remotePeerConnection.setLocalDescription(remoteSdp)
  localPeerConnection.setRemoteDescription(remoteSdp)
}
const iceListenner = () => {
  localPeerConnection.onicecandidate = (event) => {
    console.log('I got local icecandidate info')
    if (event.candidate) {
      // add candidate to remote peer connection
      remotePeerConnection.addIceCandidate(event.candidate)
    }
  }
  // 如果监测到本地媒体流连接到本地，将其绑定到一个video标签上输出
  localPeerConnection.ontrack = (event) => {
    console.log(event)
    // localVideoRef.value.srcObject = event.streams[0];
  }
  remotePeerConnection.onicecandidate = (event) => {
    console.log('I got remote icecandidate info')
    if (event.candidate) {
      // add candidate to local peer connection
      localPeerConnection.addIceCandidate(event.candidate)
    }
  }
  remotePeerConnection.ontrack = (event) => {
    console.log(event)
    localVideoRef.value.srcObject = event.streams[0] // chrome
  }
}
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
