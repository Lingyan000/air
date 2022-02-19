<script lang="ts" setup>
  import { inject } from 'vue';
  import { NImage } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="air-col-pic2">
    <n-image
      class="air-col-pic2__pic"
      :src="'air://' + picUrlRef"
      preview-disabled
      object-fit="cover"
    />
    <n-ellipsis class="air-col-pic2__title" :line-clamp="1" :tooltip="false">{{
      titleRef
    }}</n-ellipsis>
  </div>
</template>

<style lang="less">
  .air-col-pic2 {
    cursor: pointer;
    width: 100%;
  }

  .air-col-pic2__pic {
    position: relative;
    height: 100%;
    width: 100%;
    padding-bottom: 50%;
    overflow: hidden;
  }

  .air-col-pic2__pic img {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  .air-col-pic2__title {
    line-height: 2;
    font-weight: 600;
    text-align: center;
  }
</style>
