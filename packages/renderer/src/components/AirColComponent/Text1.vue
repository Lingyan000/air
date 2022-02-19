<script lang="ts" setup>
  import { inject } from 'vue';
  import { NElement, NText } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml, isCanWrapText } from '/@/utils/text';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-element class="airHomeComponentText1">
    <n-text v-html="wrapTextToHtml(titleRef, !isCanWrapText(titleRef))" />
  </n-element>
</template>

<style>
  .airHomeComponentText1 {
    cursor: pointer;
    line-height: 3;
    border-bottom: var(--border-color) solid 1px;
  }

  .airHomeComponentText1:hover {
    background: var(--hover-color);
  }
</style>
