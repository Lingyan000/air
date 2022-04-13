<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { pxfy } from 'seemly';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';

  const { descRef, urlRef } = inject(airHomeComponentInjectionKey)!;

  const style = computed(() => {
    const [height = 'auto', mode] = descRef.value.split('&&');

    const _style: any = {
      height: pxfy(height),
    };

    if (mode == 'float') {
      _style.position = 'fixed';
      _style.top = '0';
      _style.left = '0';
      _style.width = '100%';
      _style.zIndex = '999';
    }

    return _style;
  });
</script>

<template>
  <webview v-if="urlRef" :src="urlRef" preload="./" :style="style" />
</template>
