<script lang="ts" setup>
  import { homeInjectionKey } from './interface';
  import { ref, provide, getCurrentInstance } from 'vue';
  import RuleSearch from '/@/views/home/components/RuleSearch';
  import Logo from '/@/views/home/components/Logo.vue';
  import { getArticlelistruleList } from '/@/api/articlelistrule';
  import SearchResultPanel from '/@/views/home/components/SearchResultPanel/SearchResultPanel.vue';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import PlayerModal from '/@/views/home/components/PlayerModal/PlayerModal.vue';
  import { useMessage } from 'naive-ui';
  import { splitItemUrl } from '/@/utils/rule';
  import { getLazyRuleResult } from '/@/api/parse';
  import { urlType } from '/@/utils';
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

  const handleSearch = (id: number, value: string) => {
    // 判断规则是否含有搜索解析代码
    if (artilelistruleStore.listMap.get(id)!.searchfind) {
      searchResultPanelRef.value?.open(id, value);
    } else {
      openBrowser(artilelistruleStore.listMap.get(id)!.search_url.replace('**', value));
    }
  };

  const openDetail = ({ from, type, id, url, title, rule = '' }) => {
    detailResultPanelListRef.value?.add().then((detailResultPanel) => {
      detailResultPanel.component.exposed.open(type, from, id, url, title, rule);
    });
    // detailResultPanelRef.value?.open(type, from, id, url, title);
  };

  const isActiveLoading = ref(false);
  const loadingText = ref('');

  function showLoading(text = ''): void {
    loadingText.value = text;
    isActiveLoading.value = true;
  }

  function hideLoading(): void {
    loadingText.value = '';
    isActiveLoading.value = false;
  }

  const onClickItem = (id: number, item: HikerResultOption) => {
    if (displayColType.includes(item.col_type!)) {
      return;
    }
    if (!item.url) return message.warning('链接为空，规则有误！');
    const urlRes = splitItemUrl(item.url);
    switch (urlRes.type) {
      case 'image':
        viewerApi({
          images: ['air://' + item.url],
          initialViewIndex: 1,
        });
        break;
      case 'video':
        openPlayerModal(item.title, urlRes.url);
        break;
      case 'lazyRule':
        showLoading('动态解析中');
        getLazyRuleResult({
          id,
          url: urlRes.url,
          lazyRule: urlRes.rule!,
          from: From['search'],
        })
          .then(({ data, handle }) => {
            if (handle.isRefreshPage) {
              detailResultPanelListRef.value?.refresh();
            }

            if (data === '') {
              return message.warning('链接为空，规则有误！');
            }

            switch (urlType(data)) {
              case 'video':
                openPlayerModal(item.title, data);
                break;
              case 'toast':
                message.info(data.replace('toast://', ''));
                break;
              case 'object':
                const obj = JSON.parse(data);
                if (!obj.urls && isArray(obj.urls) && obj.urls.length) {
                  message.error('没有链接');
                  break;
                }
                openPlayerModal(item.title, obj.urls[0], {
                  danmu: obj.danmu ? obj.danmu : undefined,
                  headers: obj.headers && obj.headers.length ? obj.headers[0] : undefined,
                });
                break;
              default:
                break;
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
        openBrowser(item.url);
        break;
    }
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

  const playerModalRef = ref<InstanceType<typeof PlayerModal> | null>(null);

  function openPlayerModal(title: string, url: string, otherOptions: any = {}) {
    playerModalRef.value?.open(title, url, otherOptions);
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
    <!--    <detail-result-panel ref="detailResultPanelRef" @click-item="onClickItem" />-->
    <detail-result-panel-list ref="detailResultPanelListRef" @click-item="onClickItem" />
    <!-- 播放器-->
    <player-modal ref="playerModalRef" />
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
