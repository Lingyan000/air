<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import { wrapTextToHtml } from '/@/utils/text';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="air-col-rich-text" v-html="wrapTextToHtml(titleRef)" />
</template>

<style>
  .air-col-rich-text {
  }
</style>
