<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml, isCanWrapText } from '/@/utils/text';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button size="large" tertiary class="air-col-text2">
    <n-text v-if="isCanWrapText(titleRef)" v-html="wrapTextToHtml(titleRef)" />
    <n-ellipsis v-else>{{ titleRef.replace(/\t/g, ' ') }}</n-ellipsis></n-button
  >
</template>

<style>
  .air-col-text2 {
    width: 100%;
  }

  .air-col-text2 .n-button__content {
    max-width: 100%;
  }
</style>
