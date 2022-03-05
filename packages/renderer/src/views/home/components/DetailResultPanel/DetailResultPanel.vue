<script lang="ts" setup>
  import { ref, defineExpose, Ref, computed, watch } from 'vue';
  import { getChildPageRuleResult, getRuleDetailResult, getRuleResult } from '/@/api/parse';
  import { useLoadingBar, useMessage, NGrid, NGi, NDrawer } from 'naive-ui';
  import AirColComponent from '/@/components/AirColComponent/AirColComponent.vue';
  import { normalSpan } from '/@/utils/colSpan';
  import { From } from '#/enums';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import ScrollButtonList from '/@/components/ScrollButtonList/ScrollButtonList.vue';
  import { wrapTextToHtml } from '/@/utils/text';

  const artilelistruleStore = useArtilelistruleStore();

  const artilelistruleListMap = computed(() => artilelistruleStore.listMap);

  const emit = defineEmits<{
    (e: 'clickItem', id: number, item: HikerResultOption, prefix?: string): void;
    (e: 'close'): void;
  }>();

  const currentPage: Ref<number> = ref(1);

  const loadingBar = useLoadingBar();
  const message = useMessage();

  const typeRef = ref<'childPage' | 'rule' | 'default'>('default');
  const idRef = ref<number | null>(null);
  const fromRef = ref<From>(From['home']);
  const urlRef = ref<string>('');
  const titleRef = ref<string>('');

  const active = ref(false);

  function open(type, from, id, url, title, rule) {
    typeRef.value = type;
    active.value = true;
    fromRef.value = from;
    idRef.value = id;
    urlRef.value = url;
    titleRef.value = title;
    getDetailData(rule);
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

  function getDetailData(rule = '') {
    loadingBar.start();
    let request: Promise<HikerResultOption[]> | null = null;
    if (typeRef.value === 'childPage') {
      request = getChildPageRuleResult({
        from: fromRef.value,
        id: idRef.value!,
        url: urlRef.value,
        fypage: currentPage.value + '',
      });
    } else if (typeRef.value === 'rule') {
      request = getRuleResult({
        from: fromRef.value,
        rule: rule,
        id: idRef.value!,
        url: urlRef.value,
      });
    } else {
      request = getRuleDetailResult({
        from: fromRef.value,
        id: idRef.value!,
        url: urlRef.value,
      });
    }
    if (typeRef.value)
      request
        .then((res) => {
          detailData.value = res;
          loadingBar.finish();
        })
        .catch((err) => {
          loadingBar.error();
          message.error(err.message);
        });
  }

  watch(active, (value) => {
    !value &&
      window.setTimeout(() => {
        emit('close');
      }, 300);
  });

  function close() {
    active.value = false;
  }

  function handleBack() {
    close();
  }

  function handleItemClick(item: HikerResultOption) {
    emit('clickItem', idRef.value!, item, titleRef.value);
  }

  function refresh() {
    currentPage.value = 1;
    // detailData.value = [];
    getDetailData();
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

  defineExpose({
    open,
    refresh,
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
                  handleItemClick(d);
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
              @click="handleItemClick(item)"
            />
          </n-gi>
        </template>
      </n-grid>
    </n-drawer-content>
  </n-drawer>
</template>
