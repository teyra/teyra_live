<template>
  <div class="flex justify-center items-center push-container">
    <div class="left-container flex-column">
      <div class="video-container">
        <video
          ref="localVideoRef"
          class="w-960 h-540"
          autoplay
          webkit-playsinline="true"
          playsinline
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
        ></video>
        <div class="media-action-bar" v-if="materialList.length === 0">
          <div class="box">
            <el-icon :size="30">
              <i-ep-plus />
            </el-icon>
            <span class="text">添加素材</span>
          </div>
          <div class="more-bar">
            <div class="box" @click="addMediaMaterial(MediaMaterialEnum.WINDOW)">
              <el-icon :size="30">
                <i-ep-monitor />
              </el-icon>
              <span class="text">窗口</span>
            </div>
            <div class="box" @click="addMediaMaterial(MediaMaterialEnum.CAMERA)">
              <el-icon :size="30">
                <i-ep-videoCamera />
              </el-icon>
              <span class="text">摄像头</span>
            </div>
            <div class="box">
              <el-icon :size="30">
                <i-ep-moreFilled />
              </el-icon>
              <span class="text">更多</span>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-bar opc-9 p-10 bg-white">
        <div class="left-content">
          <img src="@/assets/image/avatar.jpg" class="w-65 h-65 round-50" alt="" />
          <el-icon :size="20">
            <i-ep-microphone />
          </el-icon>
          <el-slider v-model="volume" style="width: 200px" class="slider" />
          <span>{{ volume }}%</span>
        </div>
        <div class="right-content">
          <el-button
            type="primary"
            size="large"
            v-if="liveStreamStatus === LiveStreamStatusEnum.OFFLINE"
            @click="startLive"
            >开始直播</el-button
          >
          <el-button
            type="primary"
            size="large"
            v-else-if="liveStreamStatus === LiveStreamStatusEnum.ONLINE"
            @click="stopLive"
            >结束直播</el-button
          >
        </div>
      </div>
    </div>
    <div class="right-container flex-column">
      <div class="material-list round-5 p-10 w-350 bg-white">
        <div class="c-black fs-16">素材列表</div>
        <div class="content-list">
          <div v-for="(item, index) in materialList" :key="index" class="content-item">
            <span> {{ item.name }}</span>
            <el-icon :size="20" @click="deleteMedia(index)">
              <i-ep-delete />
            </el-icon>
          </div>
        </div>
        <div>
          <el-button type="primary">添加素材</el-button>
        </div>
      </div>
      <div class="danmu-interactive p-10 round-5 w-350 bg-white">
        <div class="c-black fs-16">弹幕互动区</div>
        <div class="content-list"></div>
        <div class="send-container">
          <el-input
            v-model="message"
            placeholder="和观众聊聊吧~"
            class="small-input"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-button type="primary">发送</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="materialDialogVisible" title="添加直播素材" width="30%" center>
      <span>名称</span>
      <el-input v-model="materialName" placeholder="请输入名称"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmMedia" :disabled="!materialName">
            发送
          </el-button>
          <el-button @click="materialDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
//@ts-ignore
import { ElMessage } from 'element-plus'
import { LiveStreamStatusEnum, MediaMaterialEnum } from '@/enums/media'
import { io } from 'socket.io-client'
import { webRtcSrsPublish } from '@/api/srs'
let message = ref('')
let volume = ref(0)
let materialDialogVisible = ref(false)
let materialName = ref('')
let roomId = ref('123')
let isCreateConnection = ref(false)
let socketMessage = ref({
  name: '' as string,
  roomId: '' as string,
  socketId: '' as string
})
let currentSocketId = ref('')
let mediaStream: any = ref(null)
let liveStreamStatus = ref<LiveStreamStatusEnum>(LiveStreamStatusEnum.OFFLINE)
let localVideoRef: any = ref<HTMLVideoElement>()
let peerConnection: any = reactive({} as RTCPeerConnection)
interface materialItem {
  name: string
}
watch(
  volume,
  (newVal) => {
    if (localVideoRef.value) {
      localVideoRef.value.volume = newVal / 100
    }
  },
  {
    deep: true,
    immediate: true
  }
)
let materialList = reactive([] as materialItem[])
let websocket = ref()
onMounted(() => {
  initSocket()
})
const sendMessage = () => {
  websocket.value.emit('createRoom', roomId.value)
}
/**
 * 初始化socket
 */
const initSocket = () => {
  websocket.value = io('ws://localhost:81')
  websocket.value.on('connect', () => {
    console.log('连接成功')
  })
  websocket.value.emit('createRoom', {
    roomId: roomId.value
  })
  websocket.value.on('ownerCreate', (room: any, socketId: string) => {
    currentSocketId.value = socketId
    console.log('创建房间成功' + room + 'socketId' + socketId)
  })
  websocket.value.on('errorMake', (room: any, socketId: string) => {
    console.log('创建房间失败' + room + 'socketId' + socketId)
  })
}
const addMediaMaterial = (type: MediaMaterialEnum = MediaMaterialEnum.WINDOW) => {
  switch (type) {
    case MediaMaterialEnum.WINDOW:
      materialDialogVisible.value = true
      break
    case MediaMaterialEnum.CAMERA:
      addWindow(MediaMaterialEnum.CAMERA)
      break
    case MediaMaterialEnum.WINDOW:
      break
    default:
      break
  }
}
const confirmMedia = async () => {
  await addWindow(MediaMaterialEnum.WINDOW)
  materialList.push({
    name: materialName.value
  })
  materialName.value = ''
  materialDialogVisible.value = false
}
const deleteMedia = (index: number) => {
  materialList.splice(index, 1)
  localVideoRef.value.srcObject = null
  volume.value = 0
}
const addWindow = async (type: MediaMaterialEnum = MediaMaterialEnum.WINDOW) => {
  try {
    let event: any
    if (type === MediaMaterialEnum.WINDOW) {
      event = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
    } else if (type === MediaMaterialEnum.CAMERA) {
      event = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
    }
    localVideoRef.value.srcObject = event
    volume.value = localVideoRef.value.volume * 100
    mediaStream.value = event
  } catch (error) {
    if (type === MediaMaterialEnum.WINDOW) {
      ElMessage.error('无法获取屏幕')
      throw '无法获取屏幕'
    } else if (type === MediaMaterialEnum.CAMERA) {
      ElMessage.error('无法获取摄像头')
      throw '无法获取摄像头'
    }
  }
}
const checkPeerConnection = async () => {}
/**
 * 开始直播
 */
const startLive = async () => {
  await createPeerConnection()
  liveStreamStatus.value = LiveStreamStatusEnum.ONLINE
  websocket.value.emit('liveStreamStatus', {
    liveStreamStatus: LiveStreamStatusEnum.ONLINE,
    roomId: roomId.value
  })
}
/**
 * 结束直播
 */
const stopLive = () => {
  liveStreamStatus.value = LiveStreamStatusEnum.OFFLINE
  websocket.value.emit('liveStreamStatus', {
    liveStreamStatus: LiveStreamStatusEnum.OFFLINE,
    roomId: roomId.value
  })
}
/**
 * 发起webRTCSrs连接
 */
const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection()
  peerConnection.addTransceiver('audio', { direction: 'sendonly' })
  peerConnection.addTransceiver('video', { direction: 'sendonly' })
  if (mediaStream.value) {
    for (const track of mediaStream.value.getTracks()) {
      peerConnection.addTrack(track, mediaStream)
    }
  }

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  const session: any = await webRtcSrsPublish({
    api: import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/publish/',
    streamurl: 'webrtc://localhost/live/livestream/123',
    sdp: offer.sdp
  })
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
  )
  isCreateConnection.value = true
}
</script>
<style scoped lang="scss">
.push-container {
  height: 100vh;
  min-height: 680px;
  min-width: 1320px;
  width: 100vw;
  background-image: url('@/assets/image/live_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .left-container {
    .video-container {
      position: relative;
      display: flex;
      background: #000000;
      .media-action-bar {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        .more-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .box {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 6px;
          background: #252121;
          color: #434242;
          width: 100px;
          height: 100px;
          justify-content: center;
          margin: 10px;
          cursor: pointer;
          .text {
            font-size: 14px;
            padding-top: 10px;
          }
        }
      }
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
        .el-icon:hover {
          color: #ff6699;
        }
        .el-slider {
          --el-slider-button-size: 16px;
        }
        .slider {
          margin: 0 15px;
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
    height: 625px;
    margin-left: 10px;

    .material-list {
      height: 49%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .content-list {
        height: 200px;
        .content-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .danmu-interactive {
      height: 49%;
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