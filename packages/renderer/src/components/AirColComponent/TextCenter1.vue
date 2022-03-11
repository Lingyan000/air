<script lang="ts" setup>
  import { inject } from 'vue';
  import { NElement } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml, isCanWrapText } from '/@/utils/text';

  const { titleRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-element class="airHomeComponentCenterText1">
    <div v-html="wrapTextToHtml(titleRef, !isCanWrapText(titleRef))" />
    <div
      v-if="wrapTextToHtml(descRef, !isCanWrapText(descRef))"
      v-html="wrapTextToHtml(descRef, !isCanWrapText(descRef))"
    />
  </n-element>
</template>

<style>
  .airHomeComponentCenterText1 {
    cursor: pointer;
    line-height: 3;
    border-bottom: var(--border-color) solid 1px;
    text-align: center;
  }

  .airHomeComponentCenterText1:hover {
    background: var(--hover-color);
  }
</style>
