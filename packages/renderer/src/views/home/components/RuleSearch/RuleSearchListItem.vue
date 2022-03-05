<script lang="ts" setup>
  import { NElement } from 'naive-ui';
  import { isHex } from '/@/utils';
  import ArticleListRule from '../../../../../../main/src/apis/core/database/sqlite/models/articlelistrule';
  import loadImage from '/@/assets/svg/deadpool.svg';

  defineProps({
    data: {
      type: Object as () => ArticleListRule,
      default: () => ({}),
    },
    active: {
      type: Boolean as () => boolean,
      default: false,
    },
  });
</script>

<template>
  <div
    class="homeRuleSearchListItem tw-transition tw-duration-300 tw-ease-in-out tw-transform hover:tw--translate-y-1 hover:tw-scale-110"
    :class="{ isActive: active }"
  >
    <template v-if="!data.icon || isHex(data.icon)">
      <n-element
        tag="div"
        :style="{
          color: 'var(--base-color)',
          background: `var(${data.icon || '--primary-color'})`,
        }"
        class="homeRuleSearchListItem__icon homeRuleSearchListItem__icon--normal"
        >{{ data.title }}
      </n-element>
    </template>
    <template v-else>
      <div class="homeRuleSearchListItem__icon">
        <img
          v-lazy="{
            src: 'air://' + data.icon,
            loading: loadImage,
            error: loadImage,
          }"
          class="tw-object-cover"
          width="32"
          height="32"
        />
      </div>
    </template>
    <div class="homeRuleSearchListItem__itemText tw-ml-sm"> {{ data.title }}</div>
  </div>
</template>

<style>
  .homeRuleSearchListItem {
    cursor: pointer;
    display: flex;
    height: 100%;
    width: 100%;
    text-decoration: none;
    align-items: center;
  }

  .homeRuleSearchListItem.isActive {
    color: #00a8ff;
    font-weight: 700;
  }

  .homeRuleSearchListItem__icon {
    width: 32px;
    height: 32px;
    display: inline-block;
    border-radius: 6px;
    overflow: hidden;
  }

  .homeRuleSearchListItem__icon--normal {
    width: 32px;
    height: 32px;
    line-height: 33px;
    display: inline-block;
    border-radius: 6px;
    overflow: hidden;
    font-size: 16px;
    text-indent: 7px;
    text-align: center;
    letter-spacing: 6px;
  }

  .homeRuleSearchListItem__itemText {
    flex: 1;
    font-size: 14px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
</style>
