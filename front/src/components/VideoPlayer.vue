<template>
  <div class="video-center" ref="videoCenter">
    <video
      ref="localVideo"
      :width="width"
      :height="height"
      preload="auto"
      webkit-playsinline="true"
      playsinline="true"
      x-webkIT-airplay="allow"
      x5-video-player-tyPE="h5"
      x5-video-player-fullscreen="true"
      x5-video-orientation="portraint"
      autoplay
      muted
    ></video>
    <div class="custom-conctrols">
      <div class="conctrols-content">
        <div class="left">
          <el-icon :size="30" @click="play" v-if="!playing">
            <i-ep-VideoPlay />
          </el-icon>
          <el-icon :size="30" @click="pause" v-else><i-ep-VideoPause /></el-icon>
          <div class="volume-control">
            <div class="volume-line">
              <el-slider v-model="volume" vertical height="80px" />
            </div>
            <img
              src="@/assets/image/player/volume1_d52cb8.webp"
              width="24"
              height="24"
              class="voice"
              alt=""
              style="margin-left: 10px"
              v-if="!muted"
              @click="muteVoice(false)"
            />
            <img
              src="@/assets/image/player/volume2_7870c9.webp"
              width="24"
              height="24"
              class="voice"
              alt=""
              style="margin-left: 10px"
              v-else
              @click="muteVoice(true)"
            />
          </div>
        </div>
        <el-icon :size="24" @click="fullscreen">
          <i-ep-FullScreen />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="VideoPlayer">
import { onMounted, ref, watch } from 'vue'
let videoCenter: any = ref<HTMLElement>()
let localVideo: any = ref<HTMLVideoElement>()
let playing = ref(false)
let muted = ref(false)
let volume = ref(0)
let isFullscreen = ref(false)
let width = ref(1000)
let height = ref(540)
watch(
  volume,
  (newVal) => {
    if (localVideo.value) {
      localVideo.value.volume = newVal / 100
      if (newVal > 0) {
        localVideo.value.muted = false
        muted.value = false
      } else {
        muted.value = true
        localVideo.value.muted = true
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)
onMounted(() => {
  document.addEventListener('fullscreenchange', (evt) => {
    if (document.fullscreenElement) {
      console.log('进入全屏')
      isFullscreen.value = true
      width.value = window.screen.availWidth
      height.value = window.screen.availHeight
    } else {
      console.log('退出全屏')
      isFullscreen.value = false
      width.value = 1000
      height.value = 540
    }
  })
})
const play = () => {
  localVideo.value.muted = false
  localVideo.value.play()
  playing.value = true
  muted.value = false
}
const pause = () => {
  localVideo.value.pause()
  playing.value = false
}
const muteVoice = (mode = false) => {
  if (mode) {
    localVideo.value.muted = false
    muted.value = false
  } else {
    localVideo.value.muted = true
    muted.value = true
  }
}
const fullscreen = () => {
  if (isFullscreen.value) {
    console.log('isFullscreen')
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  } else {
    if (videoCenter.value.requestFullscreen) {
      videoCenter.value.requestFullscreen()
    } else if (videoCenter.value.mozRequestFullscreen) {
      videoCenter.value.mozRequestFullscreen()
    } else if (videoCenter.value.webkitRequestFullScreen) {
      videoCenter.value.webkitRequestFullScreen()
    }
  }
}
</script>

<style scoped lang="scss">
.video-center {
  video::-webkit-media-controls {
    display: none !important;
  }
  video {
    object-fit: fill;
  }
  video:hover + .custom-conctrols .conctrols-content {
    animation: move 1.5s linear;
  }
  @keyframes move {
    0% {
      opacity: 1;
    }
    99% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
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
    min-height: 30px;
    .conctrols-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      color: #ffffff;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
      cursor: pointer;
      padding: 10px;
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
  .custom-conctrols:hover .conctrols-content {
    opacity: 1;
  }
}
</style>
