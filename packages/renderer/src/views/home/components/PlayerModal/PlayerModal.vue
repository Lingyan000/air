<script lang="ts" setup>
  import { ref, defineExpose } from 'vue';
  import { NModal } from 'naive-ui';
  // import AirDplayer from '/@/components/AirDplayer/AirDplayer.vue';
  import { UPDATE_REQUEST_HEADERS } from '#/events/constants';
  import { camelCase, isObject } from 'lodash';
  import { PC_UA } from '#/parse/constants';
  import Artplayer from '/@/components/Artplayer/Artplayer.vue';
  import flvjs from 'flv.js';
  import Hls from 'hls.js';
  import artplayerPluginDanmuku from '/@/plugins/artplayer-plugin-danmuku/src/index';
  import { isHlsUrl } from '/@/utils';

  const { api } = window;
  //
  // const route = useRoute();

  const showModal = ref(false);

  const userAgent = ref(PC_UA);
  const referer = ref<any>(null);

  const options = ref<any>({});

  // const webviewSrc = computed(() => {
  //   return window.location.href.replace(route.fullPath, '/player');
  // });

  function open(title: string, url: string, otherOptions: any = {}) {
    const {
      headers = {
        referer: url,
      },
      danmu,
    } = otherOptions;

    if (/;{.*}$/.test(url)) {
      const urlHeader = url.replace(/.*;{(.*)}$/, '$1').replace(/；；/g, ';');
      urlHeader.split(';').forEach((item) => {
        const [key, value] = item.split('@');
        headers[key] = value;
      });
      url = url.replace(/;{.*}$/, '');
    }

    if (isObject(headers)) {
      Object.keys(headers).forEach((key) => {
        switch (camelCase(key)) {
          case 'userAgent':
            userAgent.value = headers[key];
            break;
          case 'referer':
            referer.value = headers[key];
            break;
        }
      });
      let url2 = new URL(url);
      let hostname = url2.hostname;
      let filter = {
        urls: [`*://${hostname}:*/*`],
      };
      api.send(UPDATE_REQUEST_HEADERS, filter, headers || {});
    }

    showModal.value = true;

    // nextTick(() => {
    //   const webview: Electron.WebviewTag | null = document.querySelector('#playerWebview');
    //
    //   webview?.addEventListener('dom-ready', () => {
    //     webview?.send(WEBVIEW_PLAY_VIDEO, url, otherOptions);
    //     webview?.openDevTools();
    //   });
    // });

    options.value = {
      title,
      mutex: false,
      url: url,
      autoplay: true,
      fullscreen: true,
      pip: true,
      screenshot: true,
      setting: true,
      playbackRate: true,
      type: isHlsUrl(url) ? 'm3u8' : '',
      customType: {
        flv: function (video, url) {
          const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: url,
          });
          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
        },
        m3u8: function (video, url) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        },
      },
      plugins: [
        artplayerPluginDanmuku({
          danmuku: danmu ? danmu : [],
          speed: 5,
          maxlength: 50,
          margin: [10, 100],
          opacity: 1,
          fontSize: 25,
          synchronousPlayback: false,
        }),
      ],
      // video: {
      //   url: url,
      //   type: 'auto',
      // },
      // danmaku: danmu
      //   ? {
      //       addition: [danmu],
      //     }
      //   : undefined,
    };
  }

  const style = {
    width: '600px',
    height: '400px',
    margin: '60px auto 0',
  };

  defineExpose({
    open,
  });
</script>

<template>
  <n-modal v-model:show="showModal" :close-on-esc="false">
    <!--    <webview-->
    <!--      v-if="showModal"-->
    <!--      id="playerWebview"-->
    <!--      :src="webviewSrc"-->
    <!--      :preload="preloadPath"-->
    <!--      :useragent="userAgent"-->
    <!--      :httpreferrer="referer"-->
    <!--    />-->
    <!--    <webview id="playerWebview" :src="webviewSrc" :preload="preloadPath" />-->
    <!--    <air-dplayer :options="options" />-->
    <artplayer :option="options" :style="style" />
  </n-modal>
</template>
