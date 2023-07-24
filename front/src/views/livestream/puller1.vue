<template>
  <div>
    <video
      ref="localVideoRef"
      controls
      style="width: 1000px; height: 400px"
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
  </div>
</template>

<script setup lang="ts">
import { webRtcSrsPullApi } from '@/api/modules/srs'
import { onMounted, reactive, ref } from 'vue'
let localVideoRef: any = ref<HTMLVideoElement>()
let peerConnection: any = reactive({} as RTCPeerConnection)
onMounted(() => {
  createPeerConnection()
})
/**
 * 发起webRTCSrs连接
 */
const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection()
  peerConnection.addEventListener('connectionstatechange', (event: any) => {
    console.log(peerConnection.connectionState)
    if (peerConnection.connectionState === 'connected') {
      // Peers connected!
    }
  })
  peerConnection.ontrack = (event: any) => {
    const videoElment: any = document.querySelector('video')
    videoElment.srcObject = event.streams[0]
  }
  peerConnection.addTransceiver('audio', { direction: 'recvonly' })
  peerConnection.addTransceiver('video', { direction: 'recvonly' })
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  const session: any = await webRtcSrsPullApi({
    api: import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/whip-play/',
    streamurl: `webrtc://${import.meta.env.VITE_IP}/live/livestream`,
    sdp: offer.sdp
  })
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
  )
}
</script>

<style scoped></style>
