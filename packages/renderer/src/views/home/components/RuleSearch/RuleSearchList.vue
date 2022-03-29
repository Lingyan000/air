<script lang="tsx" setup>
  import { computed, defineComponent, inject, onMounted, ref, toRef, watch } from 'vue';
  import { NGrid, NGi, NInput, NSpace, NIcon, NDivider } from 'naive-ui';
  import { homeRuleSearchInjectionKey } from '/@/views/home/components/RuleSearch/interface';
  import RuleSearchListItem from '/@/views/home/components/RuleSearch/RuleSearchListItem.vue';
  import { FlashOutline } from '@vicons/ionicons5';
  import { VirtualList, VirtualListInst } from 'vueuc';
  import { ScrollbarInst, NScrollbar } from 'naive-ui/es/_internal';
  import { spliteArray } from '/@/utils';

  const { activeIdRef, popMaxHeight, lastSearchRuleList, searchRuleList } = inject(
    homeRuleSearchInjectionKey
  )!;

  const handleClick = (id) => {
    activeIdRef.value = id;
  };

  const filterValue = ref('');

  const gridCols = '1 200:2 400:3 600:4 800:5 1000:6';

  const chunkSize = ref(1);

  const items = computed(() => {
    return spliteArray(
      searchRuleList.value.filter((d) => d.title.includes(filterValue.value)),
      chunkSize.value
    );
  });

  const topHeight = computed(() => {
    return Math.ceil(lastSearchRuleList.value.length / chunkSize.value) * 44 + 48;
  });

  const visibleItemsTag = defineComponent({
    setup() {
      const gridRef = ref<typeof NGrid | null>(null);

      onMounted(() => {
        const responsiveCols = toRef(gridRef.value!, 'responsiveCols');

        watch(responsiveCols, (v: number) => {
          chunkSize.value = v;
        });
      });

      return {
        gridRef,
      };
    },

    render() {
      return (
        <NSpace vertical>
          <div
            class="tw-absolute tw-w-full"
            style={{
              top: -topHeight.value + 'px',
            }}
          >
            <NSpace vertical>
              <NInput v-model={[filterValue.value, 'value']} placeholder="筛选小程序">
                {{
                  prefix: <NIcon component={FlashOutline} />,
                }}
              </NInput>
              <NGrid xGap="12" yGap="12" cols={gridCols}>
                {{
                  default: lastSearchRuleList.value.map((item) => {
                    return (
                      <NGi key={item.id} class="tw-w-full">
                        <RuleSearchListItem
                          data={item}
                          active={item.id === activeIdRef.value}
                          filterValue={filterValue.value}
                          onClick={() => handleClick(item.id)}
                        />
                      </NGi>
                    );
                  }),
                }}
              </NGrid>
            </NSpace>
          </div>
          <NDivider style="margin: 0" />
          <NGrid ref="gridRef" xGap="12" yGap="12" cols={gridCols}>
            {this.$slots.default ? this.$slots.default() : <></>}
          </NGrid>
        </NSpace>
      );
    },
  });

  const scrollerInstRef = ref<ScrollbarInst | null>(null);
  const vlInstRef = ref<VirtualListInst | null>(null);

  function syncVLScroller(): void {
    scrollerInstRef.value?.sync();
  }

  function scrollContainer(): HTMLElement | null {
    const { value } = vlInstRef;
    if (!value) return null;
    const { listElRef } = value;
    return listElRef;
  }

  function scrollContent(): HTMLElement | null {
    const { value } = vlInstRef;
    if (!value) return null;
    const { itemsElRef } = value;
    return itemsElRef;
  }
</script>

<template>
  <n-scrollbar
    ref="scrollerInstRef"
    class="homeRuleSearchList"
    :style="{ maxHeight: popMaxHeight - 30 + 'px' }"
    :container="scrollContainer"
    :content="scrollContent"
  >
    <virtual-list
      ref="vlInstRef"
      :padding-top="8 + topHeight"
      :padding-bottom="8"
      :items="items.length ? items : [{}]"
      :item-size="44"
      :visible-items-tag="visibleItemsTag"
      :show-scrollbar="false"
      class="homeRuleSearchList__content tw-relative"
      @resize="syncVLScroller"
      @scroll="syncVLScroller"
    >
      <template #default="{ item }">
        <n-gi v-for="item2 in item.chunk" :key="item2.id" class="tw-w-full">
          <rule-search-list-item
            :data="item2"
            :active="item2.id === activeIdRef"
            @click="handleClick(item2.id)"
          />
        </n-gi>
      </template>
    </virtual-list>
    <!--    <div class="homeRuleSearchList__content">-->
    <!--      <n-space vertical>-->
    <!--        <n-input v-model:value="filterValue" placeholder="筛选小程序">-->
    <!--          <template #prefix>-->
    <!--            <n-icon :component="FlashOutline" />-->
    <!--          </template>-->
    <!--        </n-input>-->
    <!--        <n-grid x-gap="12" y-gap="12" :cols="gridCols">-->
    <!--          <n-gi v-for="item in lastSearchRuleList" :key="item.id" class="tw-w-full">-->
    <!--            <rule-search-list-item-->
    <!--              :data="item"-->
    <!--              :active="item.id === activeIdRef"-->
    <!--              @click="handleClick(item.id)"-->
    <!--            />-->
    <!--          </n-gi>-->
    <!--        </n-grid>-->
    <!--        <n-divider style="margin: 0" />-->
    <!--        <n-grid x-gap="12" y-gap="12" :cols="gridCols">-->
    <!--          <n-gi-->
    <!--            v-for="item in searchRuleList.filter((d) => d.title.includes(filterValue))"-->
    <!--            :key="item.id"-->
    <!--            class="tw-w-full"-->
    <!--          >-->
    <!--            <rule-search-list-item-->
    <!--              :data="item"-->
    <!--              :active="item.id === activeIdRef"-->
    <!--              @click="handleClick(item.id)"-->
    <!--            />-->
    <!--          </n-gi>-->
    <!--        </n-grid>-->
    <!--      </n-space>-->
    <!--    </div>-->
  </n-scrollbar>
</template>

<style>
  .homeRuleSearchList {
    word-wrap: break-word;
    word-break: break-all;
  }

  .homeRuleSearchList__content {
    padding: 0 14px;
    box-sizing: border-box;
  }
</style>
