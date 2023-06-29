<template>
  <div>
    <video-player :options="playerOptions" />
  </div>
</template>
<script setup lang="ts">
import flvjs from 'flv.js'
import { onMounted, ref } from 'vue'
let videoElement: any = ref<HTMLElement>()
import { VideoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'videojs-flash'
let playerOptions = {
  height: '300',
  width: '600',
  sources: [
    {
      type: 'rtmp/mp4',
      src: 'rtmp://localhost/live/livestream/123'
    }
  ],
  techOrder: ['flash'],
  autoplay: true,
  controls: true
}
onMounted(() => {
  // console.log(flvjs.isSupported())
  // if (flvjs.isSupported()) {
  //   let flvPlayer = flvjs.createPlayer({
  //     type: 'flv',
  //     url: 'http://localhost:8080/live/livestream.flv'
  //   })
  //   flvPlayer.attachMediaElement(videoElement.value)
  //   flvPlayer.load()
  //   flvPlayer.play()
  // }
})
</script>

<style scoped></style>
