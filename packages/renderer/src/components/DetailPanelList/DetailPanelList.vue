<script lang="ts" setup>
  import DetailPanel from '/@/components/DetailPanel/DetailPanel.vue';
  import { computed, defineExpose, nextTick, ref } from 'vue';
  import { REFRESH_PAGE } from '#/events/socket-constants';
  import { useSocket } from '/@/hooks/socket';
  import { nanoid } from 'nanoid';

  const { socket } = useSocket();

  const emit = defineEmits(['clickItem']);

  const detailPageList = ref<{ id: string }[]>([]);

  const num = computed(() => detailPageList.value.length);

  const lastDetailPanelRef = computed(() => {
    if (detailPanelRefs.el.value.length === 0) {
      return null;
    }
    return detailPanelRefs.el.value[detailPanelRefs.el.value.length - 1];
  });

  const detailPanelRefs = { el: ref<typeof DetailPanel[]>([]) };

  function refresh() {
    detailPanelRefs.el.value[num.value - 1].refresh();
  }

  function getDetailPanel(id: string) {
    return detailPanelRefs.el.value.find((item) => item.id === id);
  }

  async function add() {
    const id = nanoid();

    detailPageList.value.push({
      id,
    });

    return nextTick().then(() => {
      if (lastDetailPanelRef.value?.id === id) {
        return lastDetailPanelRef.value;
      }
      return getDetailPanel(id);
    });
  }

  function remove(id: string) {
    setTimeout(() => {
      const index = detailPageList.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        detailPageList.value.splice(index, 1);
      }
    }, 300);
  }

  function panelClickItem(...args) {
    emit('clickItem', ...args);
  }

  // 监听刷新页面
  socket.on(REFRESH_PAGE, refresh);

  defineExpose({
    add,
  });
</script>

<template>
  <detail-panel
    v-for="item in detailPageList"
    :id="item.id"
    :ref="detailPanelRefs.el"
    :key="item.id"
    @click-item="panelClickItem"
    @close="remove"
  />
</template>
