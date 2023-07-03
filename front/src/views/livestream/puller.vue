<template>
  <div class="flex justify-center items-center pull-container" v-if="platForm === 1">
    <Header></Header>
    <div class="left-container flex-column">
      <div class="video-container" ref="videoContainer">
        <div class="live-info-bar opc-9 p-10 bg-white">
          <div class="left-content">
            <img src="@/assets/image/avatar.jpg" class="w-65 h-65 round-50" alt="" />
            <div class="info-container">
              <span class="username">{{ liveInfo.title }}</span>
              <span class="title">{{ liveInfo.description }}</span>
            </div>
          </div>
        </div>
        <div class="video-center" ref="videoCenter">
          <video ref="localVideoRef" v-show="liveStreamStatus === LiveStreamStatusEnum.ONLINE" :width="videoWidth"
            :height="videoHeight" style="object-fit: fill" autoplay muted></video>
          <div class="custom-conctrols">
            <div class="left">
              <el-icon :size="30" @click="play" v-if="!playing">
                <i-ep-VideoPlay />
              </el-icon>
              <el-icon :size="30" @click="pause" v-else><i-ep-VideoPause /></el-icon>
              <div class="volume-control">
                <div class="volume-line">
                  <el-slider v-model="volume" vertical height="80px" />
                </div>
                <img src="@/assets/image/player/volume1_d52cb8.webp" width="24" height="24" class="voice" alt=""
                  style="margin-left: 10px;" v-if="!muted" @click="muteVoice(false)">
                <img src="@/assets/image/player/volume2_7870c9.webp" width="24" height="24" class="voice" alt=""
                  style="margin-left: 10px;" v-else @click="muteVoice(true)">
              </div>
            </div>
            <el-icon :size="24" @click="fullscreen">
              <i-ep-FullScreen />
            </el-icon>
          </div>
        </div>

        <div class="more-container" v-if="liveStreamStatus === LiveStreamStatusEnum.OFFLINE">
          <div class="title">主播还在赶来的路上。。。</div>
          <div class="more-bar">
            <div class="box" v-for="(item, index) in moreLiveRoomList" :key="index">
              <img src="@/assets/image/live_cover.png" />
              <div class="text-container">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-bar opc-9 p-10 bg-white">
        <div v-for="(item, index) in 6" :key="index" class="gift">
          <img src="@/assets/image/gift.avif" alt="" />
          <span class="name">鲜花</span>
          <span class="price">1314电池</span>
        </div>
      </div>
    </div>
    <div class="right-container flex-column">
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
          <el-input v-model="message" placeholder="和主播聊聊吧~" class="small-input" maxlength="20" show-word-limit></el-input>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="platForm === 2" class="mobile-container">
    <div class="top-container">
      <div class="header-container">
        <div class="left">
          <img src="@/assets/image/avatar.jpg" class="round-50" alt="" />
          <span class="title">{{ liveInfo.title }}</span>
        </div>
        <van-icon name="share-o" color="#ffffff" size="1rem" />
      </div>
      <div class="live-watch-count">
        <span>63.1万人看过</span>
      </div>
    </div>
    <div class="video-container">
      <video ref="localVideoRef" class="video" v-show="liveStreamStatus === LiveStreamStatusEnum.ONLINE" preload="auto"
        webkit-playsinline="true" playsinline="true" x-webkIT-airplay="allow" x5-video-player-tyPE="h5"
        x5-video-player-fullscreen="true" x5-video-orientation="portraint" autoplay muted></video>
      <van-icon name="play-circle-o" v-if="!playing" color="#ffffff" @click="play" class="play" size="3rem" />
    </div>
    <div class="bottom-container">
      <div class="fullscreen">
        <img src="@/assets/image/landscape.svg" width="25" height="30" alt="" @click="fullscreen" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { io } from 'socket.io-client'
import Header from '@/components/Header.vue'
import { LiveStreamStatusEnum } from '@/enums/media'
import { webRtcSrsPullApi } from '@/api/modules/srs'
import { getLiveRoomDetailApi, getLiveStatusApi } from '@/api/modules/liveroom'
import { useRoute } from 'vue-router'
import { UserStore } from '@/stores/modules/user'
import { LiveRoom } from '@/api/interface/liveroom'
const userStore = UserStore()
const route = useRoute()
let websocket = ref()
let platForm = ref(1)
let liveInfo = reactive({
  roomId: '',
  title: '',
  description: ''
})
let moreLiveRoomList = reactive([
  {
    name: '权倾朝野-新厅驾到'
  },
  {
    name: '权倾朝野-新厅驾到'
  },
  {
    name: '权倾朝野-新厅驾到'
  }
])
let message = ref('')
let contentList: any = ref<HTMLElement>()
let messageList = reactive([] as LiveRoom.LiveroomMessageResult[])
let liveStreamStatus = ref<LiveStreamStatusEnum>(LiveStreamStatusEnum.OFFLINE)
let localVideoRef: any = ref<HTMLVideoElement>()
let videoCenter: any = ref<HTMLElement>()
let peerConnection = reactive({} as RTCPeerConnection)
let videoWidth = ref(1000)
let videoHeight = ref(540)
let playing = ref(false)
let volume = ref(0)
let muted = ref(false)
watch(
  volume,
  (newVal) => {
    if (localVideoRef.value) {
      localVideoRef.value.volume = newVal / 100
      if (newVal > 0) {
        localVideoRef.value.muted = false
        muted.value = false
      }
      else {
        muted.value = true
        localVideoRef.value.muted = true
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)
onMounted(() => {
  init()
})
const fullscreen = () => {
  console.log(videoCenter.value.webkitRequestFullScreen);
  if (localVideoRef.value.enterFullscreen) {
    console.log('requestFullScreen')
    localVideoRef.value.enterFullscreen()
  } else if (localVideoRef.value.mozEnterFullscreen) {
    console.log('mozRequestFullScreen')
    localVideoRef.value.mozEnterFullscreen()
  } else if (videoCenter.value.webkitRequestFullScreen) {
    console.log('webkitEnterFullscreen')
    videoCenter.value.webkitRequestFullScreen()
    console.log();
    videoWidth.value = window.screen.availWidth
    videoHeight.value = window.screen.availHeight

  }
}
const play = () => {
  localVideoRef.value.muted = false
  localVideoRef.value.play()
  playing.value = true
  muted.value = false
}
const pause = () => {
  localVideoRef.value.pause()
  playing.value = false
}
const muteVoice = (mode = false) => {
  if (mode) {
    localVideoRef.value.muted = false
    muted.value = false
  }
  else {
    localVideoRef.value.muted = true
    muted.value = true
  }
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
const getLiveRoomDetail = async (id: any) => {
  const { data } = await getLiveRoomDetailApi(id)
  liveInfo.roomId = data._id
  liveInfo.title = data.title
  liveInfo.description = data.description
}
const init = async () => {
  const {
    query: { id }
  } = route
  if (id) {
    checkPlatform()
    await getLiveRoomDetail(id)
    await getLiveStatus(id)
    await createPeerConnection()
    initSocket()
    document.addEventListener("fullscreenchange", (e) => {
      console.log('fullscreenchange', e)
      nextTick(() => {
        console.log('fullscreenchange', e)
      })
    })
  }
}
const checkPlatform = () => {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    console.log('手机端')
    platForm.value = 2
  } else {
    platForm.value = 1
    console.log('PC端')
  }
}
const getLiveStatus = async (id: any) => {
  const { data } = await getLiveStatusApi(id)
  liveStreamStatus.value = data
}
/**
 * 发起webRTCSrs连接
 */
const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection()
  peerConnection.addEventListener('connectionstatechange', (event) => {
    console.log(peerConnection.connectionState)
    if (peerConnection.connectionState === 'connected') {
      // Peers connected!
    }
  })
  peerConnection.ontrack = (event) => {
    localVideoRef.value.srcObject = event.streams[0]
    playing.value = true
    muted.value = localVideoRef.value.muted
    // volume.value = localVideoRef.value.volume * 100
  }
  peerConnection.addTransceiver('audio', { direction: 'recvonly' })
  peerConnection.addTransceiver('video', { direction: 'recvonly' })
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  const session: any = await webRtcSrsPullApi({
    api: import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/play/',
    streamurl: `webrtc://${import.meta.env.VITE_IP}/live/livestream/${liveInfo.roomId}`,
    sdp: offer.sdp
  })
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
  )
}
/**
 * 初始化socket
 */
const initSocket = () => {
  websocket.value = io(import.meta.env.VITE_SOCKET_URL)
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
      const tip =
        '系统提示：哔哩哔哩直播内容及互动评论须严格遵守直播规范，严禁传播违法违规、低俗血暴、吸烟酗酒、造谣诈骗等不良有害信息。如有违规，平台将对违规直播间或账号进行相应的处罚！注意理性打赏，严禁未成年人直播或打赏。请勿轻信各类招聘征婚、代练代抽、刷钻、购买礼包码、游戏币等广告信息，且如主播在推广商品中诱导私下交易，请谨慎判断，以免上当受骗。'
      messageList.push({
        text: tip,
        type: LiveRoom.MESSAGE_TYPE.NOTICE
      })
    }
  )
  websocket.value.on('memberJoined', ({ username }: any) => {
    messageList.push({
      text: username + '  进入直播间',
      type: LiveRoom.MESSAGE_TYPE.WELCOME
    })
  })
  websocket.value.on('message', (data: LiveRoom.LiveroomMessageResult) => {
    messageList.push({
      type: LiveRoom.MESSAGE_TYPE.DANMU,
      text: data.text,
      username: data.username,
      userId: data.userId,
      role: data.role
    })
  })
  websocket.value.on('liveStreamStatus', (status: LiveStreamStatusEnum) => {
    console.log('liveStreamStatus' + status)
    if (status === LiveStreamStatusEnum.ONLINE) {
      liveStreamStatus.value = LiveStreamStatusEnum.ONLINE
      console.log('开播啦')
      console.log(peerConnection.connectionState)
    } else if (status === LiveStreamStatusEnum.OFFLINE) {
      liveStreamStatus.value = LiveStreamStatusEnum.OFFLINE
      console.log('下播啦')
    }
  })
}
</script>
<style>
.el-slider__button {
  width: 15px;
  height: 15px;
}
</style>
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
      flex-direction: column;
      width: 1000px;
      height: 630px;
      background: #131212;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;

      .video-center {
        video::-webkit-media-controls {
          display: none !important;
        }

        .controls {
          z-index: 2147483647;
          opacity: 1;
        }

        .custom-conctrols {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          color: #ffffff;
          background: #131212;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          cursor: pointer;

          .left {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .volume-control {
              position: relative;
              display: flex;

              .volume-line {
                display: none;
                position: absolute;
                bottom: 25px;
              }
            }

            .volume-control:hover .volume-line {
              display: block;
            }
          }

          .el-icon:hover {
            cursor: pointer;
            color: #ffffff;
          }
        }
      }



      .live-info-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

        .left-content {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .info-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 10px;

            .username {
              font-size: 16px;
              font-weight: 500;
            }

            .title {
              font-size: 14px;
            }
          }
        }
      }

      .more-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
          font-size: 28px;
          color: rgb(170, 170, 170);
          text-align: center;
          margin-bottom: 20px;
        }

        .more-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .box {
          border-radius: 6px;
          color: #ffffff;
          width: 192px;
          height: 110px;
          margin: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          .text-container {
            font-size: 14px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            background: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%);

            span {
              margin-bottom: 10px;
              margin-left: 10px;
            }
          }

          img {
            width: 192px;
            height: 108px;
            border-radius: 4px;
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
      padding: 10px 30px;

      .gift {
        display: flex;
        flex-direction: column;
        align-items: center;

        .name {
          font-size: 14px;
          color: #000;
        }

        .price {
          font-size: 12px;
          color: #645f5f;
        }
      }
    }
  }

  .right-container {
    opacity: 0.9;
    justify-content: space-between;
    height: 740px;
    margin-left: 10px;

    .danmu-interactive {
      height: 100%;
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
        height: 600px;
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

.mobile-container {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgb(27 28 30) 0%, rgb(24 21 23) 100%);

  .top-container {
    padding: 10px;
    margin-bottom: 5rem;

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 35px;
          height: 35px;
        }

        .title {
          color: #f0eaea;
          font-size: 16px;
          font-weight: 500;
          margin-left: 10px;
        }
      }
    }

    .live-watch-count {
      padding: 10px 0;

      span {
        color: #c8c5c5;
        font-size: 12px;
      }
    }
  }

  .video-container {
    width: 100%;
    height: 30%;
    position: relative;
    background-color: #131212;

    .video {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }

    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .bottom-container {
    padding: 10px;

    .fullscreen {
      text-align: right;
    }
  }
}
</style>
