<template>
  <div class="flex justify-center items-center push-container">
    <div class="left-container flex-column">
      <div class="video-container">
        <video ref="localVideoRef" class="w-960 h-540" style="object-fit: fill" autoplay></video>
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
          <div class="container">
            <div class="title-content">
              <div class="label-container" v-if="!editTitleVisible">
                <span class="title">{{ liveInfo.title }}</span>
                <el-icon :size="20" @click="editTitleVisible = true">
                  <i-ep-edit />
                </el-icon>
              </div>
              <div class="edit-title" v-if="editTitleVisible">
                <el-input
                  v-model="liveInfo.title"
                  class="input"
                  maxlength="15"
                  show-word-limit
                  placeholder="请说点什么吧"
                ></el-input>
                <el-button @click="confirmTitle" type="primary" size="small">确定</el-button>
                <el-button @click="cancelTitle" size="small">取消</el-button>
              </div>
            </div>
            <div class="volume">
              <el-icon :size="20">
                <i-ep-microphone />
              </el-icon>
              <el-slider v-model="volume" style="width: 200px" class="slider" />
              <span>{{ volume }}%</span>
            </div>
          </div>
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
        <div class="content-list" ref="contentList">
          <div v-for="(item, index) in messageList" :key="index" class="content-item">
            <div v-if="item.type === LiveRoom.MESSAGE_TYPE.DANMU">
              <span v-if="item.role === 4" class="host">主播</span>
              <span v-if="item.role === 3" class="manager">管理员</span>
              <span class="username"> {{ item.username }} :</span>
              <span class="text">{{ item.text }}</span>
            </div>
            <div class="tip" v-if="item.type === LiveRoom.MESSAGE_TYPE.NOTICE">
              <span class="text">{{ item.text }}</span>
            </div>
            <div class="join" v-if="item.type === LiveRoom.MESSAGE_TYPE.WELCOME">
              <span class="text">{{ item.text }}</span>
            </div>
          </div>
        </div>
        <div class="send-container">
          <el-input
            v-model="message"
            placeholder="和观众聊聊吧~"
            class="small-input"
            maxlength="20"
            show-word-limit
          ></el-input>
          <el-button type="primary" @click="sendMessage">发送</el-button>
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
import { ElMessage } from 'element-plus'
import { io } from 'socket.io-client'
import { LiveStreamStatusEnum, MediaMaterialEnum } from '@/enums/media'
import { webRtcSrsPublishApi } from '@/api/modules/srs'
import {
  getLiveRoomDetailApi,
  updateLiveRoomTitleApi,
  getUserRoleListApi
} from '@/api/modules/liveroom'
import { useRoute } from 'vue-router'
import { UserStore } from '@/stores/modules/user'
import { LiveRoom } from '@/api/interface/liveroom'
const userStore = UserStore()
const route = useRoute()
//websocket
let websocket = ref()
let message = ref('')
let messageList = reactive([] as LiveRoom.LiveroomMessageResult[])
let contentList: any = ref<HTMLElement>()
let editTitleVisible = ref(false)
let liveInfo = reactive({
  title: '',
  description: '',
  roomId: ''
})
// webRTC
let materialName = ref('')
let materialDialogVisible = ref(false)
let volume = ref(0)
let mediaStream: any = ref(null)
let liveStreamStatus = ref<LiveStreamStatusEnum>(LiveStreamStatusEnum.OFFLINE)
let localVideoRef: any = ref<HTMLVideoElement>()
let peerConnection: any = reactive({} as RTCPeerConnection)
let materialList = reactive([] as LiveRoom.MaterialItem[])

onMounted(() => {
  init()
})
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
const init = async () => {
  const {
    query: { id }
  } = route
  if (id) {
    await getLiveRoomDetail(id)
    await getUserRoleList()
    initSocket()
  }
}
/**
 * 获取直播间用户角色列表
 */
const getUserRoleList = async () => {
  const { data } = await getUserRoleListApi(liveInfo.roomId)
  // userRoleList = data
}
const confirmTitle = async () => {
  await updateLiveRoomTitleApi(liveInfo.roomId, {
    title: liveInfo.title
  })
  editTitleVisible.value = false
  ElMessage.success('修改成功')
}
const cancelTitle = () => {
  editTitleVisible.value = false
}
const getLiveRoomDetail = async (id: any) => {
  const { data } = await getLiveRoomDetailApi(id)
  liveInfo.roomId = data._id
  liveInfo.title = data.title
  liveInfo.description = data.description
}
const sendMessage = () => {
  if (!message.value) {
    return
  }
  websocket.value.emit(
    'message',
    {
      text: message.value,
      roomId: liveInfo.roomId,
      user: userStore.userInfoGet._id
    } as LiveRoom.LiveroomMessageForm,
    () => {
      console.log('发送成功')
      contentList.value.scrollTop = contentList.value.scrollHeight
      message.value = ''
    }
  )
}
/**
 * 初始化socket
 */
const initSocket = () => {
  websocket.value = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      token: localStorage.getItem('token')
    }
  })
  websocket.value.on('connect', () => {
    console.log('连接成功')
  })
  websocket.value.emit(
    'joinRoom',
    {
      roomId: liveInfo.roomId,
      user: userStore.userInfoGet._id
    },
    ({ room }: any) => {
      console.log('加入房间成功' + room)
    }
  )
  websocket.value.on('memberJoined', ({ username }: any) => {
    messageList.push({
      text: username + '  进入直播间',
      type: LiveRoom.MESSAGE_TYPE.WELCOME
    })
  })
  websocket.value.on('message', (data: LiveRoom.LiveroomMessageResult) => {
    console.log('收到消息')
    messageList.push({
      type: LiveRoom.MESSAGE_TYPE.DANMU,
      text: data.text,
      username: data.username,
      userId: data.userId,
      role: data.role
    })
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
    await createPeerConnection()
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
/**
 * 开始直播
 */
const startLive = async () => {
  liveStreamStatus.value = LiveStreamStatusEnum.ONLINE
  websocket.value.emit('liveStreamStatus', {
    liveStreamStatus: LiveStreamStatusEnum.ONLINE,
    roomId: liveInfo.roomId
  })
}
/**
 * 结束直播
 */
const stopLive = () => {
  liveStreamStatus.value = LiveStreamStatusEnum.OFFLINE
  websocket.value.emit('liveStreamStatus', {
    liveStreamStatus: LiveStreamStatusEnum.OFFLINE,
    roomId: liveInfo.roomId
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
      peerConnection.addTrack(track, mediaStream.value)
    }
  }

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  const session: any = await webRtcSrsPublishApi({
    api:
      import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/publish/?secret=' + import.meta.env.VITE_SECRET,
    streamurl:
      `webrtc://${import.meta.env.VITE_IP}/live/${liveInfo.roomId}?secret=` +
      import.meta.env.VITE_SECRET,
    sdp: offer.sdp
  })
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
  )
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

        .container {
          display: flex;
          flex-direction: column;
          .title-content {
            .label-container {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .el-icon:hover {
                cursor: pointer;
                color: #ff6699;
              }
              .title {
                margin-right: 10px;
                color: #000;
                font-size: 16px;
                font-weight: 500;
              }
            }

            .edit-title {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .input {
                margin: 0 10px;
              }
            }
          }
          .volume {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .el-icon:hover {
              cursor: pointer;
              color: #ff6699;
            }
            .el-slider {
              --el-slider-button-size: 16px;
            }
            .slider {
              margin: 0 15px;
            }
          }
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
      .content-list::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        border: 2px solid #f2f2f2;
        background-color: #f2f2f2;
      }
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
      .content-list::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        border: 2px solid #f2f2f2;
        background-color: #f2f2f2;
      }
      .content-list {
        height: 200px;
        overflow-y: auto;
        .content-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 6px 0;
          .host {
            border: 1px solid var(--el-color-primary);
            padding: 0 5px;
            color: var(--el-color-primary);
            font-size: 12px;
            margin-right: 5px;
          }
          .manager {
            border: 1px solid var(--el-color-primary);
            padding: 0 5px;
            color: var(--el-color-primary);
            font-size: 12px;
            margin-right: 5px;
          }
          .username {
            color: #c9ccd0;
            font-size: 14px;
          }
          .text {
            color: #61666d;
            font-size: 14px;
            margin-left: 4px;
          }
          .join {
            .text {
              color: #999999;
              font-size: 14px;
            }
          }
          .tip {
            .text {
              font-size: 14px;
              color: var(--el-color-primary);
            }
          }
        }
      }
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
@/api/modules/srs
