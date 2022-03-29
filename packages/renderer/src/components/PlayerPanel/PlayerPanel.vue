<script lang="ts" setup>
  import { ref, defineExpose, watch, Ref, computed, nextTick, h } from 'vue';
  import { NDrawer, NDrawerContent, NGrid, NGi, NDropdown } from 'naive-ui';
  import { SET_DEFAULT_HEADERS, UPDATE_REQUEST_HEADERS } from '#/events/constants';
  import { camelCase, cloneDeep, isObject } from 'lodash';
  import { PC_UA } from '#/parse/constants';
  import Artplayer from '/@/components/Artplayer/Artplayer.vue';
  import flvjs from 'flv.js';
  import Hls from 'hls.js';
  import artplayerPluginDanmuku from '/@/plugins/artplayer-plugin-danmuku/src/index';
  import { isHlsUrl } from '/@/utils';
  // import ploadingGif from '/@/assets/images/ploading.gif';
  import stateSvg from '/@/assets/svg/state.svg';
  import indicatorSvg from '/@/assets/svg/indicator.svg';
  import { useDesignSettingStore } from '/@/store/modules/designSetting';
  import { throttle } from 'lodash';
  import { getPos, record } from '/@/api/playerposhis';
  import { players } from '/@/utils/playUtils';
  import { DropdownMixedOption } from 'naive-ui/lib/dropdown/src/interface';
  import tb from 'ts-toolbelt';
  import * as Models from '#/models';

  const { api } = window;

  const emit = defineEmits<{
    (
      e: 'click-selected',
      articlelistruleRef: tb.Object.Optional<Models.Articlelistrule>,
      item: any,
      orgin: any
    ): void;
  }>();

  const designSettingStore = useDesignSettingStore();

  const videoTitle = ref('');

  const activeRef = ref(false);

  const userAgent = ref(PC_UA);
  const referer = ref<any>(null);

  const options = ref<any>({});

  const filter: Ref<{
    urls: string[];
  }> = ref({
    urls: [],
  });

  const articlelistruleRef = ref<tb.Object.Optional<Models.Articlelistrule>>({});

  // 是否需要设置 Header
  const isNeedSetHeader = ref(false);

  const artRef: Ref<typeof Artplayer | null> = ref(null);

  const currentPlayUrl = ref('');

  const hikerResultOption: Ref<HikerResultOption | null> = ref(null);

  const currentOrgin = ref<any>({});

  // 记录播放链接
  const recordPlayUrl = computed(() => {
    let playUrl = currentPlayUrl.value;
    if (hikerResultOption.value?.extra?.id) {
      playUrl = hikerResultOption.value?.extra?.id;
    }
    return playUrl;
  });

  // 视频播放进度
  const posRef = ref(0);

  const selectedList = ref<any[]>([]);

  let artInstance: typeof Artplayer | null = null;

  let currentSelectedIndex = ref<number>(-1);

  async function show(
    title: string,
    url: string,
    item: HikerResultOption,
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    otherOptions: any = {}
  ) {
    articlelistruleRef.value = articlelistrule;
    videoTitle.value = title;
    hikerResultOption.value = item;
    const { headers, danmu, subtitle, origin } = otherOptions;

    currentOrgin.value = origin;

    if (origin?.selectedList && currentSelectedIndex.value < 0) {
      selectedList.value = origin.selectedList;
      for (let [index, item] of origin.selectedList.entries()) {
        if (item.use) {
          currentSelectedIndex.value = index;
          break;
        }
      }
    }

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
      hostname && filter.value.urls.push(`*://${hostname}:*/*`);
      isNeedSetHeader.value = true;
      watch(
        filter,
        (v) => {
          api.send(UPDATE_REQUEST_HEADERS, cloneDeep(v), headers || {});
        },
        {
          deep: true,
          immediate: true,
        }
      );
    }

    currentPlayUrl.value = url;

    try {
      posRef.value = await getPos({
        playurl: recordPlayUrl.value,
      });
    } catch (e) {}

    options.value = {
      title,
      autoMini: true,
      // autoSize: true,
      mutex: false,
      url: url,
      subtitle: {
        url: subtitle ? subtitle : '',
      },
      autoplay: true,
      fullscreen: true,
      pip: true,
      screenshot: true,
      setting: true,
      controls: [
        {
          position: 'right',
          html: '隐藏弹幕',
          click: function (_, event) {
            nextTick(() => {
              if (artInstance?.plugins.artplayerPluginDanmuku.isHide) {
                artInstance?.plugins.artplayerPluginDanmuku.show();
                event.target.innerText = '隐藏弹幕';
              } else {
                artInstance?.plugins.artplayerPluginDanmuku.hide();
                event.target.innerText = '显示弹幕';
              }
            });
          },
        },
        {
          position: 'right',
          html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',
          style: {
            display: 'flex',
            alignItems: 'center',
          },
          mounted: function ($setting) {
            const $range = $setting.querySelector('input[type=range]');
            $range.addEventListener('change', () => {
              artInstance?.plugins.artplayerPluginDanmuku.config({
                fontSize: Number($range.value),
              });
            });
          },
        },
      ],
      playbackRate: true,
      type: isHlsUrl(url) ? 'm3u8' : '',
      theme: designSettingStore.appTheme,
      customType: {
        flv: function (video, url) {
          const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: url,
          });
          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
          const unwatch1 = watch(activeRef, (v) => {
            if (!v) {
              flvPlayer.destroy();
              unwatch1();
              unwatch2();
            }
          });
          const unwatch2 = watch(currentPlayUrl, () => {
            flvPlayer.destroy();
            unwatch1();
            unwatch2();
          });
        },
        m3u8: function (video, url) {
          const hls = new Hls({
            xhrSetup: (xhr, url) => {
              if (isNeedSetHeader.value) {
                let url2 = new URL(url);
                let hostname = url2.hostname;
                if (hostname && !filter.value.urls.includes(`*://${hostname}:*/*`)) {
                  filter.value.urls.push(`*://${hostname}:*/*`);
                }
              }
            },
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          const unwatch1 = watch(activeRef, (v) => {
            if (!v) {
              hls.destroy();
              unwatch1();
              unwatch2();
            }
          });
          const unwatch2 = watch(currentPlayUrl, () => {
            hls.destroy();
            unwatch1();
            unwatch2();
          });
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
      icons: {
        // loading: `<img src="${ploadingGif}" width="90">`,
        state: `<img width="150" heigth="150" src="${stateSvg}">`,
        indicator: `<img width="16" heigth="16" src="${indicatorSvg}">`,
      },
    };

    if (activeRef.value) {
      nextTick(() => {
        if (artInstance) {
          artInstance.switchUrl(url, title);
          artInstance.type = isHlsUrl(url) ? 'm3u8' : '';
          // artInstance.url = url;
          artInstance.subtitle = {
            url: subtitle ? subtitle : '',
          };
          artInstance.plugins.artplayerPluginDanmuku
            .config({
              danmuku: danmu ? danmu : [],
            })
            .load();
        }
      });
    }

    activeRef.value = true;
  }

  const handleRecord = throttle((url, timeStamp) => {
    return record({
      playurl: url,
      pos: timeStamp,
    }).catch(() => {});
  }, 1000);

  // 获取播放器实例
  function getInstance(instance: typeof Artplayer) {
    artInstance = instance;
    instance.on('video:timeupdate', (event) => {
      handleRecord(recordPlayUrl.value, event.target.currentTime);
    });
    instance.on('video:loadedmetadata', () => {
      window.setTimeout(() => {
        if (artInstance && posRef.value) artInstance.seek = posRef.value;
      }, 500);
    });
  }

  watch(activeRef, (v) => {
    if (!v) {
      posRef.value = 0;
      currentSelectedIndex.value = -1;
      currentPlayUrl.value = '';
      document.pictureInPictureElement && document.exitPictureInPicture();
      isNeedSetHeader.value = false;
      filter.value.urls = [];
      api.send(SET_DEFAULT_HEADERS);
    }
  });

  const style = {
    height: '400px',
  };

  const externalPlayerOptions = computed((): DropdownMixedOption[] => {
    const playersList = players(currentPlayUrl.value, videoTitle.value);
    return playersList.map((d) => ({
      icon: () =>
        h('img', {
          src: d.icon,
          style: {
            width: '18px',
            height: '18px',
          },
        }),
      label: d.name,
      key: d.name,
      props: {
        onClick: () => {
          window.openBrowser(d.scheme);
        },
      },
    }));
  });

  function clickSelected(item, index) {
    currentSelectedIndex.value = index;
    emit('click-selected', articlelistruleRef.value, item, currentOrgin.value);
  }

  defineExpose({
    show,
  });
</script>

<template>
  <n-drawer
    v-model:show="activeRef"
    :close-on-esc="false"
    width="100%"
    to="#layout-body"
    display-directive="if"
  >
    <n-drawer-content
      :native-scrollbar="false"
      body-style="padding-bottom: 100px"
      body-content-style=""
    >
      <template #header>
        <n-page-header :title="videoTitle" @back="activeRef = false"></n-page-header>
      </template>
      <template #default>
        <artplayer
          ref="artRef"
          :option="options"
          :pos="posRef"
          :style="style"
          @get-instance="getInstance"
        />
        <n-h3 prefix="bar"> 选集 </n-h3>
        <n-grid cols="4 600:6 800:8 1200:12" x-gap="12" y-gap="12">
          <n-gi
            v-for="(item, index) in selectedList"
            :key="index"
            @click="clickSelected(item, index)"
          >
            <n-button
              :type="currentSelectedIndex === index ? 'primary' : 'default'"
              size="large"
              tertiary
              class="selected__item tw-w-full tw-child-w-full tw-text-center"
              ><n-ellipsis :tooltip="false">{{ item.title }}</n-ellipsis></n-button
            >
          </n-gi>
        </n-grid>
        <n-h3 prefix="bar"> 工具 </n-h3>
        <n-dropdown trigger="click" :options="externalPlayerOptions">
          <n-button size="large">调用外部播放器</n-button>
        </n-dropdown>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
  .selected__item /deep/ .n-button__content {
    display: block;
  }
</style>
