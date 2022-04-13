<script lang="ts" setup>
  import { defineExpose, ref, Ref, watch } from 'vue';
  import { NDrawer, NDrawerContent, NGrid, NGi } from 'naive-ui';
  import ViewHistoryItem from './ViewHistoryItem.vue';
  import * as Model from '#/models';
  import { all } from '/@/api/viewhistory';
  import isJSON from 'validator/lib/isJSON';

  const emit = defineEmits<{
    (e: 'click-item', params: Model.Articlelistrule, item: Model.ViewHistory): void;
  }>();

  const active: Ref<boolean> = ref(false);
  const data: Ref<Model.ViewHistory[]> = ref([]);
  const currentPage: Ref<number> = ref(1);
  const pageSize: Ref<number> = ref(50);
  const count: Ref<number> = ref(0);
  const loading: Ref<boolean> = ref(false);

  function show() {
    active.value = true;
    getData();
  }

  function getData() {
    loading.value = true;
    all({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    })
      .then((res) => {
        data.value = res.rows;
        count.value = res.count;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function onClickItem(item: Model.ViewHistory) {
    if (item.params && isJSON(item.params)) {
      const params = JSON.parse(item.params);
      emit('click-item', params, item);
    } else {
      window.openBrowser(item.url);
    }
    active.value = false;
  }

  watch([currentPage, pageSize], () => {
    getData();
  });

  defineExpose({
    show,
  });
</script>

<template>
  <n-drawer
    v-model:show="active"
    :auto-focus="false"
    height="80%"
    placement="bottom"
    to="#layout-body"
  >
    <n-drawer-content
      :native-scrollbar="false"
      body-content-style="min-height: 100%"
      title="历史记录"
    >
      <template v-if="loading">
        <n-grid x-gap="12" y-gap="8" cols="1 600:2 1200:4">
          <n-gi v-for="i in 3" :key="i">
            <n-skeleton style="height: 8em" :sharp="false" />
          </n-gi>
        </n-grid>
      </template>
      <n-grid v-else x-gap="12" y-gap="8" cols="1 600:2 1200:4">
        <n-gi v-for="item in data" :key="item.id" @click="onClickItem(item)">
          <view-history-item :data="item" />
        </n-gi>
      </n-grid>
      <template #footer>
        <n-pagination v-model:page="currentPage" :page-count="Math.ceil(count / pageSize) || 1" />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
