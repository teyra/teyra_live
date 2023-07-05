<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
let websocket = ref()
onMounted(async () => {
  websocket.value = io(import.meta.env.VITE_SOCKET_URL)
  websocket.value.on('connect', () => {
    console.log('连接成功')
  })
  websocket.value.emit(
    'createRoom',
    {
      roomId: '23123'
    },
    (data: any) => {
      const { room } = data
      console.log('创建房间成功' + room)
    }
  )
  websocket.value.on('ownerCreate', (data: any) => {})
  // Create a device (use browser auto-detection).
  // Communicate with our server app to retrieve router RTP capabilities.
  websocket.value.emit('getRouterCapabilities', (data: any) => {
    console.log('获取路由参数' + data)
  })
  // const routerRtpCapabilities = await mySignaling.request('getRouterCapabilities')
  // // Load the device with the router RTP capabilities.
  // await device.load({ routerRtpCapabilities })

  // // Check whether we can produce video to the router.
  // if (!device.canProduce('video')) {
  //   console.warn('cannot produce video')
  //   // Abort next steps.
  // }
  // // Create a transport in the server for sending our media through it.
  // const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
  //   await mySignaling.request('createTransport', {
  //     sctpCapabilities: device.sctpCapabilities
  //   })
  // // Create the local representation of our server-side transport.
  // const sendTransport = device.createSendTransport({
  //   id,
  //   iceParameters,
  //   iceCandidates,
  //   dtlsParameters,
  //   sctpParameters
  // })

  // // Set transport "connect" event handler.
  // sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
  //   // Here we must communicate our local parameters to our remote transport.
  //   try {
  //     await mySignaling.request('transport-connect', {
  //       transportId: sendTransport.id,
  //       dtlsParameters
  //     })

  //     // Done in the server, tell our transport.
  //     callback()
  //   } catch (error) {
  //     // Something was wrong in server side.
  //     errback(error)
  //   }
  // })

  // // Set transport "produce" event handler.
  // sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
  //   // Here we must communicate our local parameters to our remote transport.
  //   try {
  //     const { id } = await mySignaling.request('produce', {
  //       transportId: sendTransport.id,
  //       kind,
  //       rtpParameters,
  //       appData
  //     })

  //     // Done in the server, pass the response to our transport.
  //     callback({ id })
  //   } catch (error) {
  //     // Something was wrong in server side.
  //     errback(error)
  //   }
  // })

  // // Set transport "producedata" event handler.
  // sendTransport.on(
  //   'producedata',
  //   async ({ sctpStreamParameters, label, protocol, appData }, callback, errback) => {
  //     // Here we must communicate our local parameters to our remote transport.
  //     try {
  //       const { id } = await mySignaling.request('produceData', {
  //         transportId: sendTransport.id,
  //         sctpStreamParameters,
  //         label,
  //         protocol,
  //         appData
  //       })

  //       // Done in the server, pass the response to our transport.
  //       callback({ id })
  //     } catch (error) {
  //       // Something was wrong in server side.
  //       errback(error)
  //     }
  //   }
  // )

  // // Produce our webcam video.
  // const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  // const webcamTrack = stream.getVideoTracks()[0]
  // const webcamProducer = await sendTransport.produce({ track: webcamTrack })

  // // Produce data (DataChannel).
  // const dataProducer = await sendTransport.produceData({ ordered: true, label: 'foo' })
})
</script>

<style scoped></style>
