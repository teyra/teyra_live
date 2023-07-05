<template>
  <div class="video-center" ref="videoCenter" @click="showControls">
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
    <div class="custom-conctrols" ref="customConctrols" v-show="props.controls && isShowControls">
      <div class="conctrols-content">
        <div class="left">
          <van-icon
            name="play-circle-o"
            color="#ffffff"
            size="2rem"
            v-if="!playing"
            @click="play"
          />
          <van-icon name="pause-circle-o" color="#ffffff" size="2rem" v-else @click="pause" />
          <div class="volume-control">
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
    <van-icon
      name="play-circle-o"
      v-if="!playing"
      color="#ffffff"
      class="play"
      size="3rem"
      @click.stop="play"
    />
  </div>
  <div class="bottom-container">
    <div class="fullscreen">
      <img src="@/assets/image/landscape.svg" width="25" height="30" alt="" @click="fullscreen" />
    </div>
  </div>
</template>

<script setup lang="ts" name="VideoPlayer">
import { onMounted, ref, watch } from 'vue'
let videoCenter: any = ref<HTMLVideoElement>()
let localVideo: any = ref<HTMLVideoElement>()
let customConctrols: any = ref<HTMLElement>()
let playing = ref(false)
let muted = ref(false)
let volume = ref(0)
let width = ref(0)
let height = ref(0)
let isShowControls = ref(false)
let countTimer: any = null
const props = defineProps({
  controls: {
    type: Boolean,
    default: false
  }
})
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
  width.value = window.screen.availWidth
  height.value = (window.screen.availWidth * 9) / 16
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
  if (localVideo.value.webkitEnterFullscreen) {
    localVideo.value.webkitEnterFullscreen()
  }
}
const showControls = () => {
  isShowControls.value = true
  clearInterval(countTimer)
  countTimer = setTimeout(() => {
    isShowControls.value = false
  }, 5000)
}
</script>
<style scoped lang="scss">
.video-center {
  position: relative;
  display: flex;
  background: #252424;
  video {
    object-fit: fill;
  }
  // video:hover + .custom-conctrols .conctrols-content {
  //   animation: move 3s linear;
  // }
  // @keyframes move {
  //   0% {
  //     opacity: 1;
  //   }
  //   99% {
  //     opacity: 1;
  //   }
  //   100% {
  //     opacity: 0;
  //   }
  // }
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
      opacity: 1;
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
        }
      }

      .el-icon:active {
        cursor: pointer;
        color: #ffffff;
      }
    }
  }
  // .custom-conctrols:hover .conctrols-content {
  //   opacity: 1;
  // }
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
</style>
