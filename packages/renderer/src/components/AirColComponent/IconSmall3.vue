<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-button size="large" quaternary class="air-col-icon-small3">
    <template #icon>
      <n-image
        :src="'air://' + picUrlRef"
        class="airHomeComponentIcon2Round__icon"
        preview-disabled
      />
    </template>
    {{ titleRef }}
  </n-button>
</template>

<style>
  .air-col-icon-small3 {
    width: 100%;
  }
</style>
