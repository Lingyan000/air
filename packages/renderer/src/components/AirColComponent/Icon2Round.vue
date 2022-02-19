<script lang="ts" setup>
  import { inject } from 'vue';
  import { NButton } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml, isCanWrapText } from '/@/utils/text';

  const { titleRef, picUrlRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button tertiary class="airHomeComponentIcon2Round" size="large">
    <template #icon>
      <n-image :src="'air://' + picUrlRef" class="airHomeComponentIcon2Round__icon" />
    </template>
    <n-text v-html="wrapTextToHtml(titleRef, !isCanWrapText(titleRef))" />
  </n-button>
</template>

<style>
  .airHomeComponentIcon2Round {
    width: 100%;
    justify-content: flex-start;
  }

  .airHomeComponentIcon2Round__icon {
    border-radius: 50%;
  }
</style>
