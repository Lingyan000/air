<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="air-col-long-text">{{ titleRef }}</div>
</template>

<style>
  .air-col-long-text {
    width: 100%;
  }
</style>
