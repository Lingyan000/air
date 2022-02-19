<script lang="ts" setup>
  import { ref } from 'vue';
  import { NButton, NScrollbar, NSpace, NIcon, NModal } from 'naive-ui';
  import { ChevronForward as ChevronForwardIcon } from '@vicons/ionicons5';
  import { removeHTMLTag } from '/@/utils';

  interface Props {
    data: HikerResultOption[];
  }

  const { data = [] } = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'clickItem', item: HikerResultOption): void;
  }>();

  const currentIndex = ref(0);

  function handleItemClick(item: HikerResultOption, index: number) {
    currentIndex.value = index;
    emit('clickItem', item);
  }

  const showModal = ref(false);
</script>

<template>
  <div class="scroll-button-list">
    <n-scrollbar x-scrollable style="flex: 1">
      <n-space class="scroll-button-list__content">
        <n-button
          v-for="(item, index) in data"
          :key="index"
          :type="currentIndex === index ? 'primary' : 'default'"
          secondary
          size="small"
          @click="handleItemClick(item, index)"
          >{{ removeHTMLTag(item.title) }}</n-button
        >
      </n-space>
    </n-scrollbar>
    <n-button secondary size="small" @click="showModal = true">
      <template #icon>
        <n-icon>
          <chevron-forward-icon />
        </n-icon>
      </template>
    </n-button>
  </div>
  <n-modal
    v-model:show="showModal"
    close-on-esc
    class="custom-card"
    preset="card"
    title="请选择"
    size="huge"
    :bordered="false"
    style="width: 350px"
  >
    <n-scrollbar style="height: 200px">
      <n-grid :x-gap="12" :y-gap="8" :cols="3">
        <n-gi v-for="(item, index) in data" :key="index">
          <n-button
            style="width: 100%"
            :type="currentIndex === index ? 'primary' : 'default'"
            secondary
            size="small"
            @click="
              () => {
                handleItemClick(item, index);
                showModal = false;
              }
            "
            >{{ removeHTMLTag(item.title) }}</n-button
          >
        </n-gi>
      </n-grid>
    </n-scrollbar>
  </n-modal>
</template>

<style>
  .scroll-button-list {
    --height: 50px;
    height: var(--height);
    display: flex;
  }

  .scroll-button-list__content {
    height: var(--height);
    display: flex;
    align-items: center;
  }
</style>
