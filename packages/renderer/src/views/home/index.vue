<script lang="ts" setup>
  import { homeInjectionKey } from './interface';
  import { ref, provide, getCurrentInstance } from 'vue';
  import RuleSearch from '/@/views/home/components/RuleSearch';
  import Logo from '/@/views/home/components/Logo.vue';
  import { getArticlelistruleList } from '/@/api/articlelistrule';
  import SearchResultPanel from '/@/views/home/components/SearchResultPanel/SearchResultPanel.vue';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import PlayerPanel from '/@/views/home/components/PlayerPanel/PlayerPanel.vue';
  import { useMessage } from 'naive-ui';
  import { ItemUrlSplitResult, splitItemUrl } from '/@/utils/rule';
  import { getLazyRuleResult } from '/@/api/parse';
  import VueElementLoading from 'vue-element-loading';
  import * as Models from '#/models';
  import { From } from '#/enums';
  import DetailResultPanelList from '/@/views/home/components/DetailResultPanelList/DetailResultPanelList';
  import { isArray } from 'lodash';
  import { displayColType } from '/@/views/home/options';
  import ImportRule from '/@/views/home/components/ImportRule/ImportRule.vue';

  const artilelistruleStore = useArtilelistruleStore();
  const message = useMessage();
  const currentInstance = getCurrentInstance();

  const { $viewerApi: viewerApi } = currentInstance?.appContext.config.globalProperties as any;

  const { openBrowser } = window;

  const showRuleDrawer = ref(false);
  const activeName = ref<string | undefined>(undefined);
  const ruleList = ref<Models.Articlelistrules>([]);

  /**
   * 获取规则列表
   */
  const getList = () => {
    return getArticlelistruleList().then((res) => {
      artilelistruleStore.initArtilelistrule(res);
      ruleList.value = res;
      if (ruleList.value.length > 0) {
        activeName.value = ruleList.value[0].title;
      }
    });
  };

  const searchResultPanelRef = ref<InstanceType<typeof SearchResultPanel> | null>(null);
  // const detailResultPanelRef = ref<InstanceType<typeof DetailResultPanel> | null>(null);
  const detailResultPanelListRef = ref<InstanceType<typeof DetailResultPanelList> | null>(null);

  /**
   * 搜索
   * @param id
   * @param value
   */
  const handleSearch = (id: number, value: string) => {
    // 判断规则是否含有搜索解析代码
    if (artilelistruleStore.listMap.get(id)!.searchfind) {
      searchResultPanelRef.value?.open(id, value);
    } else {
      openBrowser(artilelistruleStore.listMap.get(id)!.search_url.replace('**', value));
    }
  };

  /**
   * 打开详情页
   * @param from
   * @param type
   * @param id
   * @param url
   * @param title
   * @param rule
   */
  const openDetail = ({ from, type, id, url, title, rule = '' }) => {
    detailResultPanelListRef.value?.add().then((detailResultPanel) => {
      detailResultPanel.component.exposed.open(type, from, id, url, title, rule);
    });
    // detailResultPanelRef.value?.open(type, from, id, url, title);
  };

  const isActiveLoading = ref(false);
  const loadingText = ref('');

  /**
   * 显示加载中
   * @param text
   */
  function showLoading(text = ''): void {
    loadingText.value = text;
    isActiveLoading.value = true;
  }

  /**
   * 隐藏加载中
   */
  function hideLoading(): void {
    loadingText.value = '';
    isActiveLoading.value = false;
  }

  /**
   * 处理链接
   * @param urlRes
   * @param id
   * @param item
   * @param prefix
   */
  function handleLink(
    urlRes: ItemUrlSplitResult,
    id: number,
    item: HikerResultOption,
    prefix?: string
  ) {
    switch (urlRes.type) {
      case 'image':
        viewerApi({
          images: ['air://' + urlRes.url],
          initialViewIndex: 1,
        });
        break;
      case 'video':
        openPlayerPanel((prefix ? prefix + '-' : '') + item.title, urlRes.url);
        break;
      case 'lazyRule':
        showLoading('动态解析中');
        getLazyRuleResult({
          id,
          url: urlRes.url,
          lazyRule: urlRes.rule!,
          from: From['search'],
        })
          .then(({ data }) => {
            const lazyRuleUrlRes = splitItemUrl(data);
            if (!['lazyRule', 'rule'].includes(lazyRuleUrlRes.type)) {
              handleLink(lazyRuleUrlRes, id, item, prefix);
            }
          })
          .finally(() => {
            hideLoading();
          });

        break;
      case 'page':
        openDetail({
          type: 'childPage',
          from: From['search'],
          id,
          url: item.url,
          title: item.title,
        });
        break;
      case 'rule':
        openDetail({
          type: 'rule',
          from: From['search'],
          id,
          url: urlRes.url,
          title: item.title,
          rule: urlRes.rule,
        });
        break;
      case 'link':
        if (!urlRes.url) return message.warning('链接为空，规则有误！');
        if (urlRes.url.startsWith('http')) openBrowser(urlRes.url);
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
        openPlayerPanel(item.title, obj.urls[0], {
          danmu: obj.danmu ? obj.danmu : undefined,
          subtitle: obj.subtitle ? obj.subtitle : undefined,
          headers: obj.headers && obj.headers.length ? obj.headers[0] : undefined,
        });
        break;
    }
  }

  /**
   * 点击项
   * @param id
   * @param item
   * @param prefix
   */
  const onClickItem = (id: number, item: HikerResultOption, prefix?: string) => {
    if (displayColType.includes(item.col_type!)) {
      return;
    }
    const urlRes = splitItemUrl(item.url);
    handleLink(urlRes, id, item, prefix);
  };

  /**
   * 点击搜索列表项
   * @param option
   */
  const onSearchClickItem = (option: { id: number; item: HikerSearchResultOption }) => {
    const { id, item } = option;
    if (artilelistruleStore.$state.listMap.get(id)?.sdetail_find_rule) {
      openDetail({
        from: From['search'],
        type: 'default',
        id: id,
        url: item.url,
        title: item.title,
      });
    } else {
      onClickItem(id, item);
    }
  };

  const playerPanelRef = ref<InstanceType<typeof PlayerPanel> | null>(null);

  /**
   * 打开播放器面板
   * @param title
   * @param url
   * @param otherOptions
   */
  function openPlayerPanel(title: string, url: string, otherOptions: any = {}) {
    playerPanelRef.value?.open(title, url, otherOptions);
  }

  function sucessImport() {
    getList();
  }

  provide(homeInjectionKey, {
    activeNameRef: activeName,
    ruleListRef: ruleList,
    showRuleDrawerRef: showRuleDrawer,
  });

  getList();
</script>

<template>
  <div id="home" class="home">
    <!-- Logo-->
    <logo />
    <!-- 搜索框 -->
    <rule-search @search="handleSearch" />
    <!-- 搜索面板 -->
    <search-result-panel ref="searchResultPanelRef" @on-click-item="onSearchClickItem" />
    <!-- 二级面板 -->
    <detail-result-panel-list ref="detailResultPanelListRef" @click-item="onClickItem" />
    <!-- 播放器-->
    <player-panel ref="playerPanelRef" />
  </div>
  <import-rule @sucess="sucessImport" />
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

<style>
  .home {
    width: 100%;
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home .n-tabs-nav {
    margin: 0 20px;
  }
</style>
