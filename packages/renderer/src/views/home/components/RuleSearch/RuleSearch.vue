<script lang="ts" setup>
  import { ref, onMounted, provide, computed, watch, Ref } from 'vue';
  import { NInputGroup, NInput, NButton, NPopover, useMessage, useDialog } from 'naive-ui';
  import { Search as SearchIcon } from '@vicons/ionicons5';
  import RuleSearchList from './RuleSearchList.vue';
  import { homeRuleSearchInjectionKey } from '/@/views/home/components/RuleSearch/interface';
  import { getRect } from 'vueuc/lib/binder/src/utils';
  import { VResizeObserver } from 'vueuc';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import * as Models from '#/models';
  import { debounce, union } from 'lodash';
  import useSearchStore from '/@/store/modules/search';
  import { TrashOutline as TrashOutlineIcon } from '@vicons/ionicons5';
  import { getBaiduSuggestion } from '/@/utils';

  const emit = defineEmits(['search']);

  const dialog = useDialog();

  const artilelistruleStore = useArtilelistruleStore();

  const searchStore = useSearchStore();

  const groups = computed(() => artilelistruleStore.groups);

  // 过滤搜索列表
  const groupRef: Ref<string> = ref('全部');

  function filterSearchList(group) {
    groupRef.value = group;
  }

  const searchRuleList = computed(() =>
    groupRef.value === '全部'
      ? artilelistruleStore.searchList
      : artilelistruleStore.searchList.filter((item) => item.group_lpcolumn === groupRef.value)
  );

  const lastSearchRuleList = computed(() =>
    artilelistruleStore.lastSearchIds.reduce<Models.Articlelistrules>((acc, cur) => {
      if (
        artilelistruleStore.listMap.has(cur) &&
        artilelistruleStore.listMap.get(cur)?.search_url
      ) {
        acc.push(artilelistruleStore.listMap.get(cur)!);
      }
      return acc;
    }, [])
  );

  const activeIdRef = ref<number | null>(0);

  const activeRuleRef = computed(() => {
    if (activeIdRef.value === null) {
      return null;
    }

    return artilelistruleStore.listMap.has(activeIdRef.value)
      ? (artilelistruleStore.listMap.get(activeIdRef.value) as Models.Articlelistrule)
      : null;
  });

  const defaultId = computed(() => {
    const newSearchRuleList = union(lastSearchRuleList.value, searchRuleList.value);
    if (newSearchRuleList.length) {
      return newSearchRuleList[0].id;
    } else {
      return null;
    }
  });

  watch(
    defaultId,
    (value) => {
      activeIdRef.value = value;
    },
    {
      immediate: true,
    }
  );

  const message = useMessage();

  const searchVal = ref('');

  const historyList = computed(() =>
    searchStore.historyList.filter((item) => item.toString().includes(searchVal.value))
  );

  const borderRadius_10 = ref({
    borderRadius: '10px',
  });

  const nInputGroupRef = ref<InstanceType<typeof NInputGroup> | null>(null);
  const popWidth = ref(0);
  const popMaxHeight = ref(0);
  const handleInputGroupResize = () => {
    popWidth.value = getRect(nInputGroupRef.value?.$el).width;
    popMaxHeight.value = getRect(nInputGroupRef.value?.$el).bottom;
  };

  provide(homeRuleSearchInjectionKey, {
    activeIdRef,
    popMaxHeight,
    searchRuleList,
    lastSearchRuleList,
  });

  const handleSearch = () => {
    if (!searchVal.value) return message.warning('请输入搜索内容！');
    if (activeIdRef.value) {
      searchStore.addHistory(searchVal.value);
      artilelistruleStore.pushLastSearchIds(activeIdRef.value);
      emit('search', activeRuleRef.value!, searchVal.value);
    } else {
      message.warning('请选择搜索规则！');
    }
  };

  function deleteHistoryList() {
    dialog.warning({
      title: '提示',
      content: '确定要清空历史记录吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: () => {
        searchStore.deleteHistoryList();
      },
      onNegativeClick: () => {},
    });
  }

  onMounted(() => {
    popWidth.value = getRect(nInputGroupRef.value?.$el).width;
  });

  const baiduSuggestion = ref<string[]>([]);

  const getBaiduSu = debounce((v) => {
    getBaiduSuggestion(v)
      .then((res) => {
        baiduSuggestion.value = res.s;
      })
      .catch(() => {});
  }, 100);

  watch(searchVal, (v) => {
    if (v) {
      getBaiduSu(v);
    } else {
      baiduSuggestion.value = [];
    }
  });
</script>

<template>
  <div class="homeAirSearch">
    <v-resize-observer :on-resize="handleInputGroupResize">
      <n-input-group ref="nInputGroupRef" class="homeAirSearch__inputGroup">
        <n-popover
          :width="popWidth"
          placement="bottom-start"
          :show-arrow="false"
          size="large"
          trigger="click"
          :style="{
            boxSizing: 'border-box',
            borderRadius: '12px',
            padding: '0',
          }"
          display-directive="show"
        >
          <template #default>
            <div class="homeAirSearch__content">
              <n-scrollbar :style="{ maxHeight: popMaxHeight - 30 + 'px', width: '100px' }">
                <div class="homeAirSearch__group">
                  <n-space vertical>
                    <n-button
                      ghost
                      class="homeAirSearch__group-btn tw-tracking-wide"
                      :type="groupRef === '全部' ? 'primary' : 'default'"
                      @click="filterSearchList('全部')"
                      >全部</n-button
                    >
                    <n-button
                      v-for="(item, index) in groups"
                      :key="index"
                      ghost
                      class="homeAirSearch__group-btn tw-leading-normal"
                      :type="groupRef === item ? 'primary' : 'default'"
                      @click="filterSearchList(item)"
                      ><span class="tw-truncate">{{ item }}</span></n-button
                    >
                  </n-space>
                </div>
              </n-scrollbar>
              <rule-search-list class="homeAirSearch__list" />
            </div>
          </template>
          <template #trigger>
            <n-button
              round
              :style="{
                ...borderRadius_10,
              }"
              size="large"
            >
              {{ activeRuleRef && activeRuleRef.title }}
            </n-button>
          </template>
        </n-popover>
        <n-popover
          width="trigger"
          trigger="focus"
          placement="bottom"
          :show-arrow="false"
          size="large"
          :disabled="!historyList.length && !searchVal"
          :style="{
            borderRadius: '12px',
            padding: 0,
          }"
        >
          <template #trigger>
            <n-input
              v-model:value="searchVal"
              :style="{ flex: '1', ...borderRadius_10 }"
              placeholder="搜索"
              round
              size="large"
              @keyup.enter="
                (event: any) => {
                  $nextTick(() => {
                    event.target.blur();
                  });
                  handleSearch();
                }
              "
            />
          </template>
          <n-scrollbar :style="{ maxHeight: popMaxHeight - 30 + 'px' }">
            <n-button
              v-for="(item, index) in [...historyList, ...baiduSuggestion]"
              :key="index"
              quaternary
              class="tw-w-full tw-justify-between"
              @click="searchVal = item"
            >
              {{ item }}
            </n-button>
            <div
              v-if="!searchVal"
              class="tw-sticky tw-box-border tw-z-10 tw-w-full tw-p-sm tw-text-right"
              style="bottom: 0"
            >
              <n-button strong secondary circle type="error" @click="deleteHistoryList">
                <template #icon>
                  <n-icon>
                    <trash-outline-icon />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </n-scrollbar>
        </n-popover>
        <n-button
          :style="{
            ...borderRadius_10,
          }"
          size="large"
          type="primary"
          @click="handleSearch"
        >
          <template #icon>
            <n-icon>
              <search-icon />
            </n-icon>
          </template>
        </n-button>
      </n-input-group>
    </v-resize-observer>
  </div>
</template>

<style>
  .homeAirSearch {
    width: 80%;
  }

  .homeAirSearch__inputGroup {
    justify-content: center;
  }

  .homeAirSearch__content {
    display: flex;
    padding: 10px;
  }

  .homeAirSearch__group {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .homeAirSearch__group-btn {
    width: 80px;
  }

  .homeAirSearch__group-btn .n-button__content {
    max-width: 100%;
  }
</style>
