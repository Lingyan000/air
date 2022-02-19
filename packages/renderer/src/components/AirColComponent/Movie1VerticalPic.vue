<script lang="ts" setup>
  import { inject } from 'vue';
  import { NEllipsis } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-element class="air-col-movie1-vertical-pic">
    <n-image
      class="air-col-movie1-vertical-pic__pic"
      :src="'air://' + picUrlRef"
      object-fit="cover"
      alt=""
      preview-disabled
    />
    <div class="air-col-movie1-vertical-pic__content">
      <n-ellipsis class="air-col-movie1-vertical-pic__title" :line-clamp="2" :tooltip="false"
        >{{ titleRef }}
      </n-ellipsis>
      <n-ellipsis class="air-col-movie1-vertical-pic__desc" :line-clamp="3" :tooltip="false"
        >{{ descRef }}
      </n-ellipsis>
    </div>
  </n-element>
</template>

<style>
  .air-col-movie1-vertical-pic {
    --padding: 10px;
    padding: var(--padding);
    cursor: pointer;
    display: flex;
    border-bottom: 1px solid var(--border-color);
  }

  .air-col-movie1-vertical-pic__pic {
    z-index: 3;
    width: 8rem;
    height: 12rem;
    border-radius: 8px;
    overflow: hidden;
  }

  .air-col-movie1-vertical-pic__pic img {
    width: 100%;
    height: 100%;
  }

  .air-col-movie1-vertical-pic__pic + .air-col-movie1-vertical-pic__content {
    margin-left: 12px;
  }

  .air-col-movie1-vertical-pic__content {
    z-index: 3;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .air-col-movie1-vertical-pic__title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .air-col-movie1-vertical-pic__desc {
    font-size: 1rem;
  }
</style>
