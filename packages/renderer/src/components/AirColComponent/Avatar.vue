<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml, isCanWrapText } from '/@/utils/text';

  const { titleRef, picUrlRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-element>
    <n-space class="air-col-avatar">
      <n-avatar round size="small" :src="'air://' + picUrlRef" color="transparent" />
      <n-text v-html="wrapTextToHtml(titleRef, !isCanWrapText(titleRef))" />
    </n-space>
  </n-element>
</template>

<style>
  .air-col-avatar {
    width: 100%;
    cursor: pointer;
    height: 3rem;
    display: flex;
    align-items: center;
    line-height: 1;
  }

  .air-col-avatar:hover {
    background: var(--hover-color);
  }
</style>
