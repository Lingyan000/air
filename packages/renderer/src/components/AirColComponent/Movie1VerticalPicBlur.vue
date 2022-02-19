<script lang="ts" setup>
  import { inject } from 'vue';
  import { NEllipsis } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <div class="airHomeComponentMovie1VerticalPicBlur" :style="'--bg: url(air://' + picUrlRef + ')'">
    <n-image
      class="airHomeComponentMovie1VerticalPicBlur__pic"
      :src="'air://' + picUrlRef"
      object-fit="cover"
      alt=""
      preview-disabled
    />
    <div class="airHomeComponentMovie1VerticalPicBlur__content">
      <n-ellipsis
        class="airHomeComponentMovie1VerticalPicBlur__title"
        :line-clamp="2"
        :tooltip="false"
        >{{ titleRef }}
      </n-ellipsis>
      <n-ellipsis
        class="airHomeComponentMovie1VerticalPicBlur__desc"
        :line-clamp="3"
        :tooltip="false"
        >{{ descRef }}
      </n-ellipsis>
    </div>
  </div>
</template>

<style>
  .airHomeComponentMovie1VerticalPicBlur {
    --padding: 10px;
    width: 100%;
    padding: var(--padding);
    cursor: pointer;
    display: flex;
    background: var(--bg) no-repeat;
    background-size: cover;
    position: relative;
    box-sizing: border-box;
    z-index: 1;
    overflow: hidden;
  }

  .airHomeComponentMovie1VerticalPicBlur::after {
    content: '';
    width: calc(100% + 3 * var(--padding));
    height: calc(100% + 3 * var(--padding));
    background-size: 100% 100%;
    position: absolute;
    left: calc(0px - var(--padding));
    top: calc(0px - var(--padding));
    background: inherit;
    filter: saturate(180%) brightness(75%) blur(10px);
    z-index: 2;
  }

  .airHomeComponentMovie1VerticalPicBlur__pic {
    z-index: 3;
    width: 8rem;
    height: 12rem;
    border-radius: 8px;
    overflow: hidden;
  }

  .airHomeComponentMovie1VerticalPicBlur__pic img {
    width: 100%;
    height: 100%;
  }

  .airHomeComponentMovie1VerticalPicBlur__pic + .airHomeComponentMovie1VerticalPicBlur__content {
    margin-left: 12px;
  }

  .airHomeComponentMovie1VerticalPicBlur__content {
    z-index: 3;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .airHomeComponentMovie1VerticalPicBlur__title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
  }

  .airHomeComponentMovie1VerticalPicBlur__desc {
    font-size: 1rem;
    color: #ffffff;
  }
</style>
