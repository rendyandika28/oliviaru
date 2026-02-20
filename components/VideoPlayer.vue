<script setup lang="ts">
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

const props = defineProps<{
  src: string;
}>();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const isVideoErrorLoaded = ref(false);

let player: Player | null = null;

onMounted(() => {
  if (!videoPlayer.value) return;

  player = videojs(videoPlayer.value, {
    controls: true,
    autoplay: false,
    responsive: true,
    fluid: true,
    sources: [
      { src: props.src, label: 'Master', type: 'application/x-mpegURL' },
    ],
  });
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
    player = null;
  }
});
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
