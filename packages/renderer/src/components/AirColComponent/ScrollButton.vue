<script lang="ts" setup>
  import { NButton } from 'naive-ui';
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button class="air-col-scroll-button">{{ titleRef }}</n-button>
</template>

<style>
  .air-col-scroll-button {
    width: 100%;
  }
</style>
