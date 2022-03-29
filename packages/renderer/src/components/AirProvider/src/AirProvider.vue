<script lang="ts" setup>
  import { getCurrentInstance, provide, ref } from 'vue';
  import { useMessage, NElement } from 'naive-ui';
  import ViewHistory from '/@/components/ViewHistory/ViewHistory.vue';
  import { AirApiInjection, airApiInjectionKey } from './context';
  import { displayColType } from '/@/views/home/options';
  import { ItemUrlSplitResult, splitItemUrl } from '/@/utils/rule';
  import { getLazyRuleResult } from '/@/api/parse';
  import { From, ViewHistoryType } from '#/enums';
  import { isArray } from 'lodash';
  import { HIDE_LOADING, SHOW_LOADING } from '#/events/socket-constants';
  import { useSocket } from '/@/hooks/socket';
  import VueElementLoading from 'vue-element-loading';
  import DetailPanelList from '/@/components/DetailPanelList/DetailPanelList';
  import { DetailPanelOption } from '/@/components/DetailPanel/DetailPanel.vue';
  import PlayerPanel from '/@/components/PlayerPanel/PlayerPanel.vue';
  import * as Model from '#/models';
  import SearchPanel from '/@/components/SearchPanel/SearchPanel.vue';
  import tb from 'ts-toolbelt';
  import * as Models from '#/models';
  import { record, recordClick } from '/@/api/viewhistory';
  import { ViewHistory as ViewHistoryQuery } from '#/params';

  const currentInstance = getCurrentInstance();

  const { $viewerApi: viewerApi } = currentInstance?.appContext.config.globalProperties as any;

  const { socket } = useSocket();
  const message = useMessage();

  const viewHistoryRef = ref<typeof ViewHistory | null>(null);
  const detailPanelListRef = ref<typeof DetailPanelList | null>(null);
  const playerPanelRef = ref<typeof PlayerPanel | null>(null);
  const searchPanelRef = ref<typeof SearchPanel | null>(null);

  const loadingText = ref(''); // 加载文本
  const isActiveLoading = ref(false); // 是否激活加载

  /**
   * 显示加载器
   * @param text
   */
  function showLoading(text = ''): void {
    loadingText.value = text;
    isActiveLoading.value = true;
  }

  /**
   * 隐藏加载器
   */
  function hideLoading(): void {
    loadingText.value = '';
    isActiveLoading.value = false;
  }

  /**
   * 显示详情面板
   */
  function showDetailPanel(option: DetailPanelOption) {
    detailPanelListRef.value?.add().then((detailPanel) => {
      detailPanel.component.exposed.show(option);
    });
  }

  /**
   * 显示播放器面板
   * @param title 标题
   * @param url 视频地址
   * @param item 当前项
   * @param articlelistrule
   * @param otherOptions 其他参数
   */
  function showPlayerPanel(
    title: string,
    url: string,
    item: HikerResultOption,
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    otherOptions: any = {}
  ) {
    playerPanelRef.value?.show(title, url, item, articlelistrule, otherOptions);
  }

  function showSearchPanel(
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    value: string
  ) {
    searchPanelRef.value?.show(articlelistrule, value);
  }

  function recordViewHistory(
    urlRes: ItemUrlSplitResult,
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    item: HikerResultOption,
    index: number,
    origin?: any
  ) {
    const type = urlRes.type === 'link' ? ViewHistoryType['网页浏览'] : ViewHistoryType['二级列表'];

    if (urlRes.type === 'lazyRule') {
      let params: ViewHistoryQuery.RecordClick = {
        title: origin?.title,
        url: origin?.url,
        lastclickTitle: item.title || '',
        lastclickIndex: index,
      };
      return recordClick(params);
    }

    let params: ViewHistoryQuery.Record = {
      url: urlRes.url || '',
      title: item.title,
      group_lpcolumn: articlelistrule.group_lpcolumn,
      picurl: item.pic_url || item.img,
      type,
    };

    if (urlRes.type !== 'link') {
      params.params = {};
      if (articlelistrule.id) {
        params.ruleId = articlelistrule.id;
      } else {
        params.params = articlelistrule;
      }
      params.params.find_rule = urlRes.rule;
    }
    1;

    return record(params).catch(() => {});
  }

  /**
   * 处理链接
   * @param urlRes
   * @param articlelistrule
   * @param item
   * @param index
   * @param origin
   */
  function handleLink(
    urlRes: ItemUrlSplitResult,
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    item: HikerResultOption,
    index: number,
    origin?: any
  ) {
    switch (urlRes.type) {
      case 'image':
        viewerApi({
          images: ['air://' + urlRes.url],
          initialViewIndex: 1,
        });
        break;
      case 'video':
        showPlayerPanel(
          (origin?.title ? origin?.title + '-' : '') + item.title,
          urlRes.url,
          item,
          articlelistrule,
          {
            origin,
          }
        );
        break;
      case 'lazyRule':
        showLoading('动态解析中');
        getLazyRuleResult({
          id: articlelistrule.id,
          url: urlRes.url,
          lazyRule: urlRes.rule!,
          from: From['search'],
          originRule: articlelistrule.id ? undefined : articlelistrule,
        })
          .then(({ data }) => {
            const lazyRuleUrlRes = splitItemUrl(data);
            if (!['lazyRule', 'rule'].includes(lazyRuleUrlRes.type)) {
              handleLink(lazyRuleUrlRes, articlelistrule, item, index, origin);
            }
          })
          .finally(() => {
            hideLoading();
          });

        break;
      case 'page':
        showDetailPanel({
          type: 'childPage',
          from: From['search'],
          articlelistrule,
          url: item.url || '',
          title: item.title,
        });
        break;
      case 'rule':
        showDetailPanel({
          type: 'rule',
          from: From['search'],
          articlelistrule,
          url: urlRes.url,
          title: item.title,
          rule: urlRes.rule || '',
        });
        break;
      case 'link':
        if (!urlRes.url) return message.warning('链接为空，规则有误！');
        if (urlRes.url.startsWith('http')) window.openBrowser(urlRes.url);
        break;
      case 'toast':
        message.info(urlRes.url.replace('toast://', ''));
        break;
      case 'object':
        const obj = JSON.parse(urlRes.url);
        if (!obj.urls && isArray(obj.urls) && obj.urls.length) {
          message.error('没有链接');
          break;
        }
        showPlayerPanel(
          (origin?.title ? origin?.title + '-' : '') + item.title,
          obj.urls[0],
          item,
          articlelistrule,
          {
            danmu: obj.danmu ? obj.danmu : undefined,
            subtitle: obj.subtitle ? obj.subtitle : undefined,
            headers: obj.headers && obj.headers.length ? obj.headers[0] : undefined,
            origin,
          }
        );
        break;
    }
  }

  /**
   * 点击项
   * @param articlelistrule
   * @param item
   * @param index
   * @param origin
   */
  const onClickItem = (
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    item: HikerResultOption,
    index: number,
    origin?: any
  ) => {
    if (displayColType.includes(item.col_type!)) {
      return;
    }
    const urlRes = splitItemUrl(item.url);
    handleLink(urlRes, articlelistrule, item, index, origin);
    recordViewHistory(urlRes, articlelistrule, item, index, origin);
  };

  const onVHClickItem = (
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    item: Model.ViewHistory
  ) => {
    recordViewHistory(
      {
        type: 'rule',
        url: item.url,
        rule: articlelistrule.find_rule,
      },
      articlelistrule,
      item,
      0
    );
    showDetailPanel({
      type: 'onlyData',
      from: From['home'],
      url: item.url,
      title: item.title,
      articlelistrule: articlelistrule,
    });
  };

  /**
   * 点击搜索列表项
   * @param option
   */
  const onSearchClickItem = (option: {
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>;
    index: number;
    item: HikerSearchResultOption;
  }) => {
    const { articlelistrule, index, item } = option;
    if (articlelistrule?.sdetail_find_rule) {
      recordViewHistory(
        {
          type: 'rule',
          url: item.url || '',
          rule:
            articlelistrule.sdetail_find_rule === '*'
              ? articlelistrule.detail_find_rule
              : articlelistrule.sdetail_find_rule,
        },
        articlelistrule,
        item,
        0
      );
      showDetailPanel({
        articlelistrule,
        from: From['search'],
        type: 'default',
        url: item.url || '',
        title: item.title,
      });
    } else {
      onClickItem(articlelistrule, item, index);
    }
  };

  // socket 监听
  function socketListen() {
    socket.on(SHOW_LOADING, (text: string) => {
      showLoading(text);
    });

    socket.on(HIDE_LOADING, () => {
      hideLoading();
    });
  }

  function onClickSelected(
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
    item: HikerResultOption,
    origin?: any
  ) {
    const urlRes = splitItemUrl(item.url);
    handleLink(urlRes, articlelistrule, item, -1, origin);
  }

  socketListen();

  const api: AirApiInjection = {
    showViewHistory: () => {
      viewHistoryRef.value?.show();
    },
    showDetailPanel,
    showPlayerPanel,
    showSearchPanel,
  };

  provide(airApiInjectionKey, api);
</script>

<template>
  <slot />
  <view-history ref="viewHistoryRef" @click-item="onVHClickItem" />
  <!-- 搜索面板 -->
  <search-panel ref="searchPanelRef" @on-click-item="onSearchClickItem" />
  <!-- 二级面板 -->
  <detail-panel-list ref="detailPanelListRef" @click-item="onClickItem" />
  <!-- 播放器-->
  <player-panel ref="playerPanelRef" @click-selected="onClickSelected" />
  <!-- 加载器 -->
  <n-element>
    <vue-element-loading
      style="background: var(--base-color); opacity: var(--opacity-2)"
      :active="isActiveLoading"
      :is-full-screen="true"
    >
      <n-spin />
      <n-text tag="div" style="color: var(--primary-color)">{{ loadingText }}</n-text>
    </vue-element-loading>
  </n-element>
</template>

<style></style>
