<template>
  <div ref="artRef"></div>
</template>

<script lang="ts" setup>
  import Artplayer from 'artplayer';
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

  const { option, pos = 0 } = defineProps<{
    option: any;
    pos: number;
  }>();

  const emits = defineEmits(['get-instance']);

  var instance: any = null;

  const artRef = ref<any>(null);

  onMounted(() => {
    instance = new Artplayer({
      ...option,
      container: artRef.value,
    });

    instance.on('ready', () => {
      instance.seek = pos;
    });

    nextTick(() => {
      emits('get-instance', instance);
    });
  });

  onBeforeUnmount(() => {
    if (instance && instance.destroy) {
      instance.destroy();
    }
  });

  defineExpose({
    instance,
  });
</script>
