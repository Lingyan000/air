<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import Hls from 'hls.js';
  import DPlayer, { DPlayerDanmaku, DPlayerOptions, DPlayerVideo } from 'dplayer';
  import { merge } from 'lodash';

  const props = defineProps({
    options: {
      type: Object as () => DPlayerOptions,
      default: () => ({}),
    },
  });

  const dp = ref<typeof DPlayer.prototype | null>(null);

  function switchVideo(video: DPlayerVideo, danmaku: DPlayerDanmaku) {
    dp.value?.switchVideo(video, danmaku);
  }

  function initPlayer() {
    dp.value = new DPlayer(
      merge<DPlayerOptions, DPlayerOptions>(
        {
          container: document.getElementById('dplayer'),
          video: {
            url: '',
            customType: {
              customHls: function (video) {
                const hls = new Hls();
                hls.loadSource(video.src);
                hls.attachMedia(video);
              },
            },
          },
        },
        props.options
      )
    );
  }

  watch(
    props.options,
    () => {
      console.log(123);
      initPlayer();
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    initPlayer();
  });

  defineExpose({
    dp,
    switchVideo,
  });
</script>

<template> <div id="dplayer" /> </template>
