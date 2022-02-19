<template>
  <div ref="artRef"></div>
</template>

<script lang="ts" setup>
  import Artplayer from 'artplayer';
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { option } = defineProps<{
    option: any;
  }>();

  const emits = defineEmits(['get-instance']);

  const instance = ref<any>(null);

  const artRef = ref<any>(null);

  onMounted(() => {
    instance.value = new Artplayer({
      ...option,
      container: artRef.value,
    });

    nextTick(() => {
      emits('get-instance', instance.value);
    });
  });

  onBeforeUnmount(() => {
    if (instance.value && instance.value.destroy) {
      instance.value.destroy();
    }
  });
</script>
