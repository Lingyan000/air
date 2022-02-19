<script lang="ts" setup>
  import { inject } from 'vue';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-element class="air-col-icon_round_small_4">
    <n-image
      :src="'air://' + picUrlRef"
      class="air-col-icon_round_small_4__icon"
      height="35"
      width="35"
      object-fit="cover"
      preview-disabled
    />
    <div>{{ titleRef }}</div>
  </n-element>
</template>

<style>
  .air-col-icon_round_small_4 {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .air-col-icon_round_small_4:hover {
    background: var(--hover-color);
  }
</style>
