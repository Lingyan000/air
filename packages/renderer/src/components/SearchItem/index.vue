<template>
  <n-card class="searchItem" content-style="display: flex;" hoverable>
    <div v-show="image" class="searchItem__left">
      <img v-lazy="'air://' + image" class="searchItem__image tw-object-cover" />
    </div>
    <div class="searchItem__right tw-pl-sm">
      <n-ellipsis
        :line-clamp="1"
        class="searchItem__title"
        :tooltip="{
          width: 'trigger',
        }"
      >
        {{ title }}
      </n-ellipsis>
      <n-ellipsis
        :line-clamp="3"
        class="searchItem__content"
        :tooltip="{
          width: 'trigger',
        }"
        >{{ content }}
      </n-ellipsis>

      <n-ellipsis
        class="searchItem__description"
        :tooltip="{
          width: 'trigger',
        }"
      >
        <n-element tag="span" style="color: var(--primary-color)">{{ ruleTitle }} </n-element>
        <span style="margin: 0 5px">·</span><span>{{ description || '暂无' }}</span>
      </n-ellipsis>
    </div>
  </n-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { NCard, NElement } from 'naive-ui';
  import imgError from '~assets/svg/imgError.svg';

  export default defineComponent({
    name: 'SearchItem',

    components: {
      NCard,
      NElement,
    },

    props: {
      title: {
        type: String,
        default: '',
      },
      image: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      content: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
      ruleTitle: {
        type: String,
        required: true,
        default: '',
      },
    },

    setup() {
      return {
        imgError,
      };
    },
  });
</script>

<style lang="less">
  .searchItem {
    cursor: pointer;

    &__left {
      height: 8rem;
      width: 6rem;
    }

    &__image {
      height: 100%;
      border-radius: 8px;
      width: 100%;

      img {
        width: 100%;
      }
    }

    &__right {
      width: calc(100% - 6rem);
      height: 8rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    &__content {
      font-size: 14px;
      margin-bottom: auto;
    }

    &__description {
      display: inline-block;
      font-size: 12px;
    }
  }
</style>
