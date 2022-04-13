<script lang="ts" setup>
  import { ref, defineExpose, Ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';
  import {
    getChildPageRuleResult,
    getCustomRuleResult,
    getRuleDetailResult,
    getRuleResult,
  } from '/@/api/parse';
  import { useLoadingBar, useMessage, NGrid, NGi, NDrawer, NButton } from 'naive-ui';
  import AirColComponent from '/@/components/AirColComponent/AirColComponent.vue';
  import { normalSpan } from '/@/utils/colSpan';
  import { From } from '#/enums';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import ScrollButtonList from '/@/components/ScrollButtonList/ScrollButtonList.vue';
  import { wrapTextToHtml } from '/@/utils/text';
  import * as Models from '#/models';
  import tb from 'ts-toolbelt';
  import { getViewHistory } from '/@/api/viewhistory';
  import { getAdjacentElements } from '/@/utils';
  import { ItemUrlSplitResultType, splitItemUrl } from '/@/utils/rule';

  export type DetailPanelType = 'childPage' | 'rule' | 'onlyData' | 'default';

  export interface DetailPanelOption {
    type: DetailPanelType;
    from: From;
    articlelistrule: tb.Object.Optional<Models.Articlelistrule>;
    url: string;
    title: string;
    rule?: string;
  }

  const { id: componentId } = defineProps<{
    id: string;
  }>();

  const artilelistruleStore = useArtilelistruleStore();

  const artilelistruleListMap = computed(() => artilelistruleStore.listMap);

  const emit = defineEmits<{
    (
      e: 'clickItem',
      articlelistrule: tb.Object.Optional<Models.Articlelistrule>,
      item: HikerResultOption,
      index: number,
      origin?: any
    ): void;
    (e: 'close', id: string): void;
  }>();

  const currentPage: Ref<number> = ref(1);

  const loadingBar = useLoadingBar();
  const message = useMessage();

  const typeRef = ref<DetailPanelType>('default');
  const articlelistruleRef = ref<tb.Object.Optional<Models.Articlelistrule>>({});
  const idRef = ref<number | undefined>(undefined);
  const fromRef = ref<From>(From['home']);
  const urlRef = ref<string>('');
  const titleRef = ref<string>('');
  const viewHistoryRef = ref<Models.ViewHistory | null>(null);
  const trackShowDuration = 10000; // 足迹展示时长
  const ruleRef = ref<string>('');
  const showTrackRef = ref(false);

  const active = ref(false);

  /**
   * 展示
   * @param option
   */
  function show(option: DetailPanelOption) {
    const { type = 'default', from = From['home'], articlelistrule, url, title, rule } = option;
    typeRef.value = type;
    active.value = true;
    fromRef.value = from;
    idRef.value = articlelistrule.id;
    articlelistruleRef.value = articlelistrule;
    urlRef.value = url;
    titleRef.value = title;
    ruleRef.value = rule || '';
    getDetailData(rule).then(() => {
      getViewHistoryData();
    });
  }

  // 计算默认的列表类型
  const defaultColType = computed(() => {
    if (!idRef.value) return 'movie_3';
    const rule = artilelistruleListMap.value.get(idRef.value);

    switch (fromRef.value) {
      case From.home:
        return rule?.detail_col_type;
      case From.search:
        return rule?.sdetail_col_type;
      default:
        return 'movie_3';
    }
  });

  const detailData = ref<HikerResultOption[]>([]);

  /**
   * 获取详情数据
   * @param rule
   */
  function getDetailData(rule = '') {
    loadingBar.start();
    let request: Promise<HikerResultOption[]> | null = null;
    if (typeRef.value === 'childPage') {
      request = getChildPageRuleResult({
        from: fromRef.value,
        id: idRef.value!,
        url: urlRef.value,
        fypage: currentPage.value + '',
        originRule: !idRef.value ? articlelistruleRef.value : undefined,
      });
    } else if (typeRef.value === 'rule') {
      request = getRuleResult({
        from: fromRef.value,
        rule: rule,
        id: idRef.value!,
        url: urlRef.value,
        originRule: !idRef.value ? articlelistruleRef.value : undefined,
      });
    } else if (typeRef.value === 'onlyData') {
      request = getCustomRuleResult(articlelistruleRef.value as any);
    } else {
      request = getRuleDetailResult({
        from: fromRef.value,
        id: idRef.value!,
        url: urlRef.value,
      });
    }
    if (typeRef.value)
      return request
        .then((res) => {
          detailData.value = res;
          loadingBar.finish();
        })
        .catch((err) => {
          loadingBar.error();
          message.error(err.message);
        });
    else return Promise.resolve([]);
  }

  /**
   * 获取视频播放记录
   */
  function getViewHistoryData() {
    getViewHistory({
      title: titleRef.value,
      url: urlRef.value,
    }).then((res) => {
      if (res) {
        viewHistoryRef.value = res;
        showTrackRef.value = true;
        const time = window.setTimeout(() => {
          showTrackRef.value = false;
        }, trackShowDuration);
        onBeforeUnmount(() => {
          window.clearTimeout(time);
        });
      }
    });
  }

  watch(active, (value) => {
    if (!value) {
      detailData.value = [];
      nextTick(() => {
        emit('close', componentId);
      });
    }
  });

  function close() {
    active.value = false;
  }

  function handleBack() {
    close();
  }

  function handleItemClick(item: HikerResultOption, index) {
    emit('clickItem', articlelistruleRef.value!, item, index, {
      viewHistoryId: viewHistoryRef.value?.id,
      title: titleRef.value,
      url: urlRef.value,
      pic_url: undefined,
      selectedList: getAdjacentElements(
        detailData.value,
        index,
        (d) => d.col_type === item.col_type
      ).filter((d) =>
        (['video', 'lazyRule'] as ItemUrlSplitResultType[]).includes(splitItemUrl(d.url).type)
      ),
    });
  }

  function refresh() {
    currentPage.value = 1;
    // detailData.value = [];
    getDetailData(ruleRef.value);
  }

  function hasPrevScroll(item: HikerResultOption, index: number) {
    if (index === 0) return false;
    const prevItem = detailData.value[index - 1];
    return item.col_type === 'scroll_button' && prevItem.col_type === 'scroll_button';
  }

  function getScrollList(item: HikerResultOption, index: number): HikerResultOption[] {
    const list = [item];
    for (let i = index + 1; i < detailData.value.length; i++) {
      const nextItem = detailData.value[i];
      if (nextItem.col_type === 'scroll_button') {
        list.push(nextItem);
      } else {
        return list;
      }
    }
    return list;
  }

  function getLastClick(lastclick) {
    const [title = '', index = ''] = lastclick.split('@@');
    return {
      title: wrapTextToHtml(title, true),
      index: Number(index),
    };
  }

  defineExpose({
    show,
    refresh,
    id: componentId,
  });
</script>

<template>
  <n-drawer
    v-model:show="active"
    close-on-esc
    width="100%"
    to="#layout-body"
    display-directive="show"
    class="detailResultPanel"
  >
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <n-page-header :title="wrapTextToHtml(titleRef, true)" @back="handleBack"></n-page-header>
      </template>
      <n-button
        v-if="viewHistoryRef && viewHistoryRef.lastclick && showTrackRef"
        type="primary"
        round
        class="tw-fixed tw-z-10 tw-bottom-md tw-right-md"
        size="large"
        @click="
          handleItemClick(
            detailData[getLastClick(viewHistoryRef.lastclick).index],
            getLastClick(viewHistoryRef.lastclick).index
          )
        "
      >
        {{ '足迹：' + getLastClick(viewHistoryRef.lastclick).title }}
      </n-button>
      <n-grid x-gap="12" y-gap="8" cols="24 800:48 1000:64">
        <template v-for="(item, index) in detailData" :key="index">
          <n-gi
            v-if="!hasPrevScroll(item, index)"
            :span="normalSpan[item.col_type || defaultColType]"
          >
            <scroll-button-list
              v-if="item.col_type === 'scroll_button'"
              :data="getScrollList(item, index)"
              @click-item="
                (d) => {
                  handleItemClick(d, index);
                }
              "
            />
            <air-col-component
              v-else
              :col-type="item.col_type || defaultColType"
              :desc="item.desc"
              :pic-url="item.pic_url || item.img"
              :title="item.title"
              :url="item.url"
              @click="handleItemClick(item, index)"
            />
          </n-gi>
        </template>
      </n-grid>
    </n-drawer-content>
  </n-drawer>
</template>
