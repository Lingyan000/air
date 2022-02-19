<script lang="ts" setup>
  import { inject } from 'vue';
  import { NButton, NEllipsis } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button size="large" tertiary class="air-col-text5 tw-leading-normal"
    ><n-ellipsis>{{ titleRef }}</n-ellipsis></n-button
  >
</template>

<style>
  .air-col-text5 {
    width: 100%;
  }

  .air-col-text5 .n-button__content {
    max-width: 100%;
  }
</style>
