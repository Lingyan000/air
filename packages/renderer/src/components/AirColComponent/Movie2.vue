<script lang="ts" setup>
  import { inject } from 'vue';
  import { NImage } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="airHomeComponentMovie2">
    <div
      class="airHomeComponentMovie2__thumb"
      :class="descRef ? 'airHomeComponentMovie2__thumb--hasDesc' : ''"
    >
      <n-image
        class="airHomeComponentMovie2__pic"
        :src="'air://' + picUrlRef"
        preview-disabled
        object-fit="cover"
      />
      <n-ellipsis class="airHomeComponentMovie2__desc" :tooltip="false">{{ descRef }}</n-ellipsis>
    </div>
    <n-ellipsis class="airHomeComponentMovie2__title" :line-clamp="1" :tooltip="false">{{
      titleRef
    }}</n-ellipsis>
  </div>
</template>

<style lang="less">
  .airHomeComponentMovie2 {
    cursor: pointer;
    width: 100%;
  }

  .airHomeComponentMovie2__thumb {
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    border-radius: 8px;
    overflow: hidden;
  }

  .airHomeComponentMovie2__pic {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  .airHomeComponentMovie2__pic img {
    height: 100%;
    width: 100%;
  }

  .airHomeComponentMovie2__title {
    line-height: 2;
    font-weight: 600;
    text-align: center;
  }

  .airHomeComponentMovie2__desc {
    z-index: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    color: #fff;
    text-align: right;
    //box-shadow: inset 0 20px 50px -30px #000000;
  }

  .airHomeComponentMovie2__thumb--hasDesc::after {
    content: '';
    width: 100%;
    height: 0;
    display: block;
    position: absolute;
    bottom: 0;
    z-index: 1;
    box-shadow: 0 0 50px 25px #000000;
  }
</style>
