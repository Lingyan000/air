<script lang="ts" setup>
  import { ref, onMounted, provide, computed, watch, Ref } from 'vue';
  import { NInputGroup, NInput, NButton, NPopover, useMessage } from 'naive-ui';
  import { Search as SearchIcon } from '@vicons/ionicons5';
  import RuleSearchList from './RuleSearchList.vue';
  import { homeRuleSearchInjectionKey } from '/@/views/home/components/RuleSearch/interface';
  import { getRect } from 'vueuc/lib/binder/src/utils';
  import { VResizeObserver } from 'vueuc';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import * as Models from '#/models';
  import { union } from 'lodash';

  const emit = defineEmits(['search']);

  const artilelistruleStore = useArtilelistruleStore();

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
    if (!searchVal.value) return message.warning('要不你还是把我删了吧！');
    if (activeIdRef.value) {
      artilelistruleStore.pushLastSearchIds(activeIdRef.value);
      emit('search', activeIdRef.value!, searchVal.value);
    } else {
      message.warning('请选择搜索规则！');
    }
  };

  onMounted(() => {
    popWidth.value = getRect(nInputGroupRef.value?.$el).width;
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
          :animated="false"
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
                      :type="groupRef === '全部' ? 'primary' : ''"
                      @click="filterSearchList('全部')"
                      >全部</n-button
                    >
                    <n-button
                      v-for="(item, index) in groups"
                      :key="index"
                      ghost
                      class="homeAirSearch__group-btn tw-leading-normal tw-tracking-wide"
                      :type="groupRef === item ? 'primary' : ''"
                      @click="filterSearchList(item)"
                      ><n-ellipsis>{{ item }}</n-ellipsis></n-button
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
        <n-input
          v-model:value="searchVal"
          :style="{ flex: '1', ...borderRadius_10 }"
          placeholder="搜索"
          round
          size="large"
          @keyup.enter="handleSearch"
        />
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
