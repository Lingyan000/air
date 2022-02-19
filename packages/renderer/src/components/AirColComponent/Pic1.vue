<script lang="ts" setup>
  import { inject } from 'vue';
  import { NEllipsis, NGrid, NGi, NCard } from 'naive-ui';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { titleRef, picUrlRef, descRef } = inject(airHomeComponentInjectionKey)!;
</script>

<template>
  <n-card embedded size="small" class="airHomeComponentPic1">
    <n-grid :x-gap="12" :y-gap="8" class="airHomeComponentPic1" cols="1 800:2">
      <n-gi class="airHomeComponentPic1__pic">
        <!--      <div :style="{ background: `url('${picUrlRef}')`, height: '100%', width: '100%' }"></div>-->
        <n-image
          :src="'air://' + picUrlRef"
          object-fit="cover"
          alt=""
          :img-props="{
            style: 'flex: 1;',
          }"
          style="width: 100%"
          preview-disabled
        />
      </n-gi>
      <n-gi class="airHomeComponentPic1__content">
        <n-ellipsis class="airHomeComponentPic1__title" :line-clamp="1" :tooltip="false"
          >{{ titleRef }}
        </n-ellipsis>
        <n-ellipsis class="airHomeComponentPic1__desc" :line-clamp="3" :tooltip="false"
          >{{ descRef }}
        </n-ellipsis>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<style>
  .airHomeComponentPic1 {
    cursor: pointer;
  }

  .airHomeComponentPic1__pic {
    width: 100%;
    height: 20rem;
  }

  .airHomeComponentPic1__title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .airHomeComponentPic1__desc {
    font-size: 1rem;
  }
</style>
