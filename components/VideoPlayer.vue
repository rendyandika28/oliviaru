<script setup>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const videoPlayer = ref(null)
const isVideoErrorLoaded = ref(false)

let player = null

onMounted(() => {
  player = videojs(videoPlayer.value, {
    controls: true,
    autoplay: false,
    responsive: true,
    fluid: true,
    sources: [
      { src: props.src, label: 'Master', type: 'application/x-mpegURL' }
    ]
  })

  player.ready(() => {
    const qualityLevels = player.qualityLevels?.()
    qualityLevels?.on?.('change', () => {
      // Handle quality change if needed
    })
  })
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})
</script>

<template>
  <div>
    <p-banner v-if="isVideoErrorLoaded" variant="danger" :dismissable="false">
      URL Video Tidak ditemukan
    </p-banner>
    <video
      ref="videoPlayer"
      class="w-full video-js vjs-default-skin"
      :autoplay="false"
      controls
      controlsList="nodownload"
      @canplay="isVideoErrorLoaded = false"
      @error="isVideoErrorLoaded = true"
      oncontextmenu="return false;"
    />
  </div>
</template>
