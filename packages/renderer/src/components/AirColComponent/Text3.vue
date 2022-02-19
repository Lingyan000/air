<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button size="large" tertiary class="air-col-text3 tw-leading-normal">
    <n-ellipsis>{{ titleRef }}</n-ellipsis>
  </n-button>
</template>

<style>
  .air-col-text3 {
    width: 100%;
  }

  .air-col-text3 .n-button__content {
    max-width: 100%;
  }
</style>
