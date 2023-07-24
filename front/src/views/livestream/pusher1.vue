<template>
  <div>
    <video ref="localVideoRef" controls style="width: 1000px; height: 400px" preload="auto" webkit-playsinline="true"
      playsinline="true" x-webkIT-airplay="allow" x5-video-player-tyPE="h5" x5-video-player-fullscreen="true"
      x5-video-orientation="portraint" autoplay muted></video>
    <el-button @click="addWindow">开始推流</el-button>
  </div>
</template>

<script setup lang="ts">
import { webRtcSrsPublishApi } from '@/api/modules/srs'
import { onMounted, reactive, ref } from 'vue'
let localVideoRef: any = ref<HTMLVideoElement>()
let peerConnection: any = reactive({} as RTCPeerConnection)
let mediaStream: any = ref(null)
onMounted(() => {
  // addWindow()
})
const addWindow = async () => {
  const event = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  })
  localVideoRef.value.srcObject = event
  mediaStream.value = event
  await createPeerConnection()
}
/**
 * 发起webRTCSrs连接
 */
const createPeerConnection = async () => {
  peerConnection = new RTCPeerConnection()
  peerConnection.addTransceiver('audio', { direction: 'sendonly' })
  peerConnection.addTransceiver('video', { direction: 'sendonly' })
  for (const track of mediaStream.value.getTracks()) {
    peerConnection.addTrack(track, mediaStream.value)
  }
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  // const session: any = await webRtcSrsPublishApi({
  //   api:
  //     import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/publish/',
  //   streamurl: `webrtc://${import.meta.env.VITE_IP}/live/livestream`,
  //   sdp: offer.sdp
  // })
  const session: any = await webRtcSrsPublishApi({
    api:
      import.meta.env.VITE_HTTPS_API_URL + '/rtc/v1/whip/',
    streamurl: `webrtc://${import.meta.env.VITE_IP}/live/livestream`,
    sdp: offer.sdp
  })
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
  )
}
</script>

<style scoped></style>
