<script setup>
import videojs from 'video.js'

let player = null
const videoPlayer = ref(null)

const props = defineProps(['src'])
onMounted(() => {
  player = videojs(videoPlayer.value, {
    controls: true,
    autoplay: true,
    responsive: true,
    fluid: true,
    sources: [
      { src: props.src, label: 'Master', type: 'application/x-mpegURL' }
    ]
  })

  // Enable quality switching (if available)
  player.ready(() => {
    const qualityLevels = player.qualityLevels()
    qualityLevels.on('change', () => {
      // console.log(`Quality changed to: ${qualityLevels.selectedIndex}`)
    })
  })
})

const isVideoErrorLoaded = ref(false)
onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})
</script>

<template>
  <p-banner v-if="isVideoErrorLoaded" variant="danger" :dismissable="false">URL Video Tidak ditemukan</p-banner>
  <video @canplay="isVideoErrorLoaded = false" @error="isVideoErrorLoaded = true" ref="videoPlayer" class="video-js vjs-default-skin w-full"
    controls controlsList="nodownload" oncontextmenu="return false;" />
</template>

<style>
@import 'video.js/dist/video-js.css';
</style>
