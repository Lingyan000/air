<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { NScrollbar, NGrid, NGi, NInput, NSpace, NIcon } from 'naive-ui';
  import { homeRuleSearchInjectionKey } from '/@/views/home/components/RuleSearch/interface';
  import RuleSearchListItem from '/@/views/home/components/RuleSearch/RuleSearchListItem.vue';
  import { FlashOutline } from '@vicons/ionicons5';

  const { activeIdRef, popMaxHeight, lastSearchRuleList, searchRuleList } = inject(
    homeRuleSearchInjectionKey
  )!;

  const handleClick = (id) => {
    activeIdRef.value = id;
  };

  const filterValue = ref('');

  const gridCols = '1 200:2 400:3 600:4 800:5 1000:6';
</script>

<template>
  <n-scrollbar class="homeRuleSearchList" :style="{ maxHeight: popMaxHeight - 30 + 'px' }">
    <div class="homeRuleSearchList__content">
      <n-space vertical>
        <n-input v-model:value="filterValue" placeholder="筛选小程序">
          <template #prefix>
            <n-icon :component="FlashOutline" />
          </template>
        </n-input>
        <n-grid x-gap="12" y-gap="12" :cols="gridCols">
          <n-gi v-for="item in lastSearchRuleList" :key="item.id" class="tw-w-full">
            <rule-search-list-item
              :data="item"
              :active="item.id === activeIdRef"
              @click="handleClick(item.id)"
            />
          </n-gi>
        </n-grid>
        <n-divider style="margin: 0" />
        <n-grid x-gap="12" y-gap="12" :cols="gridCols">
          <n-gi
            v-for="item in searchRuleList.filter((d) => d.title.includes(filterValue))"
            :key="item.id"
            class="tw-w-full"
          >
            <rule-search-list-item
              :data="item"
              :active="item.id === activeIdRef"
              @click="handleClick(item.id)"
            />
          </n-gi>
        </n-grid>
      </n-space>
    </div>
  </n-scrollbar>
</template>

<style>
  .homeRuleSearchList {
    word-wrap: break-word;
    word-break: break-all;
  }

  .homeRuleSearchList__content {
    padding: 8px 14px;
    box-sizing: border-box;
  }
</style>
