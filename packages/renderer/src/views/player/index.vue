<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import AirDplayer from '/@/components/AirDplayer/AirDplayer.vue';
  import { WEBVIEW_PLAY_VIDEO } from '#/events/constants';
  import { Object as ObjectTsTool } from 'ts-toolbelt';
  import { DPlayerOptions } from 'dplayer';

  const { api } = window;

  const options = ref<ObjectTsTool.Exclude<DPlayerOptions, { container }>>({});

  const airDplayer = ref<typeof AirDplayer | null>(null);

  onMounted(() => {
    api.on(WEBVIEW_PLAY_VIDEO, (event, url, otherOptions) => {
      const { danmu = '' } = otherOptions;

      airDplayer.value?.switchVideo(
        {
          url: url,
          type: 'customHls',
        },
        danmu
          ? {
              api: danmu,
            }
          : undefined
      );
    });
  });
</script>

<template>
  <air-dplayer ref="airDplayer" :options="options" />
</template>
