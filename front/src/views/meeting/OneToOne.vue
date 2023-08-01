<template>
  <div>
    <video
      v-if="videoShow"
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
      class="video-container"
      autoplay
      muted
    ></video>
    <button @click="videoCall" v-else>视频通话</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
let width = ref(0)
let height = ref(0)
let localVideo: any = ref<HTMLVideoElement>()
let videoShow = ref(false)
onMounted(() => {
  width.value = window.screen.availWidth
  height.value = window.screen.availHeight
  console.log(width.value)
  console.log(height.value)
})
const getUserMedia = async () => {
  try {
    const event = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    localVideo.value.srcObject = event
  } catch (error) {
    throw error
  }
}
const videoCall = () => {
  videoShow.value = true
  getUserMedia()
}
</script>

<style scoped lang="scss">
.video-container {
  object-fit: fill;
  background-color: transparent;
}
</style>
