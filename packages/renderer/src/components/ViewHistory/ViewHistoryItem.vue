<script lang="ts" setup>
  import { NEllipsis, NCard } from 'naive-ui';
  import * as Model from '#/models';
  import isJSON from 'validator/lib/isJSON';
  import { wrapTextToHtml } from '/@/utils/text';

  const { data } = defineProps<{
    data: Model.ViewHistory;
  }>();
</script>

<template>
  <n-card class="view-history-item" embedded>
    <div class="tw-flex tw-h-full tw-space-x-sm">
      <img
        v-if="data.picurl"
        v-lazy="'air://' + data.picurl"
        class="tw-object-cover tw-rounded-md"
        style="width: 6em; height: 8em"
      />
      <div
        class="view-history-item__content tw-flex-1 tw-h-full tw-flex tw-flex-col"
        style="width: 0"
      >
        <div>
          <n-ellipsis
            line-clamp="1"
            :tooltip="false"
            class="view-history-item__title tw-font-bold tw-text-sm"
            >{{ data.title }}</n-ellipsis
          >
        </div>
        <div class="tw-mb-auto">
          <n-ellipsis
            v-if="data.params && isJSON(data.params)"
            line-clamp="3"
            :tooltip="false"
            class="view-history-item__params tw-text-xs tw-max-w-full"
            >{{ JSON.parse(data.params).title + '&nbsp;|&nbsp;' + data.url }}</n-ellipsis
          >
        </div>
        <div>
          <n-ellipsis line-clamp="1" :tooltip="false" class="tw-text-xs">{{
            '足迹：' + (data.lastclick ? wrapTextToHtml(data.lastclick.split('@@')[0], true) : '无')
          }}</n-ellipsis>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style>
  .view-history-item {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .view-history-item__content {
  }
</style>
