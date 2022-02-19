<script lang="ts" setup>
  import { inject } from 'vue';
  import { NImage } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="airHomeComponentMovie3">
    <div class="airHomeComponentMovie3__thumb">
      <n-image
        class="airHomeComponentMovie3__pic"
        :src="'air://' + picUrlRef"
        preview-disabled
        object-fit="cover"
      />
      <n-ellipsis class="airHomeComponentMovie3__desc" :tooltip="false">{{ descRef }}</n-ellipsis>
    </div>
    <n-ellipsis class="airHomeComponentMovie3__title" :line-clamp="1" :tooltip="false">{{
      titleRef
    }}</n-ellipsis>
  </div>
</template>

<style lang="less">
  .airHomeComponentMovie3 {
    cursor: pointer;
    width: 100%;
  }

  .airHomeComponentMovie3__thumb {
    position: relative;
    width: 100%;
    padding-bottom: 150%;
    border-radius: 8px;
    overflow: hidden;
  }

  .airHomeComponentMovie3__pic {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  .airHomeComponentMovie3__pic img {
    height: 100%;
    width: 100%;
  }

  .airHomeComponentMovie3__title {
    line-height: 2;
    font-weight: 600;
    text-align: center;
  }

  .airHomeComponentMovie3__desc {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
</style>
