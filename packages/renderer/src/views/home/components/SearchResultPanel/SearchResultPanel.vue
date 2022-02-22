<script lang="ts" setup>
  import { ref, watch, computed, Ref } from 'vue';
  import {
    NDrawer,
    NDrawerContent,
    NPageHeader,
    NGrid,
    NGi,
    NBackTop,
    useLoadingBar,
  } from 'naive-ui';
  import { getSearchRuleResult, preHandle } from '/@/api/parse';
  import SearchItem from '/@/components/SearchItem/index.vue';
  import ArticleListRule from '../../../../../../main/src/apis/core/database/sqlite/models/articlelistrule';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';

  const artilelistruleStore = useArtilelistruleStore();

  const emit = defineEmits<{
    (e: 'on-click-item', option: any): void;
  }>();

  const loadingBar = useLoadingBar();

  const idRef = ref<number | null>(null);
  const searchValRef = ref('');
  const activeRef = ref(false);

  const searchResultRef = ref<HikerSearchResultOption[]>([]);

  const isPage = computed(() => {
    return (
      idRef.value && artilelistruleStore.listMap.get(idRef.value)?.search_url.includes('fypage')
    );
  });

  function close() {
    activeRef.value = false;
  }

  function handleBack() {
    close();
  }

  const loadingRef: Ref<boolean> = ref(false);
  const currentPage: Ref<number> = ref(1);

  async function getSearchResult() {
    try {
      loadingBar.start();
      loadingRef.value = true;
      if (artilelistruleStore.listMap.get(idRef.value!)?.prerule) {
        await preHandle({
          id: idRef.value!,
        });
      }
      await getSearchRuleResult({
        id: idRef.value!,
        search: searchValRef.value,
        fypage: currentPage.value + '',
      }).then((res) => {
        loadingBar.finish();

        searchResultRef.value.push(...res);
      });
    } catch (e) {
      loadingBar.error();
    } finally {
      loadingRef.value = false;
    }
  }

  function loadMore() {
    currentPage.value++;
    getSearchResult();
  }

  function handleClick(item) {
    emit('on-click-item', {
      id: idRef.value,
      item,
    });
  }

  const searchRuleRef = computed(() => {
    if (idRef.value === null) {
      return null;
    }

    return artilelistruleStore.listMap.has(idRef.value)
      ? (artilelistruleStore.listMap.get(idRef.value) as ArticleListRule)
      : null;
  });

  // 清空搜索结果
  watch(activeRef, () => {
    searchResultRef.value = [];
    currentPage.value = 1;
  });

  function open(id: number, value: string) {
    activeRef.value = true;
    idRef.value = id;
    searchValRef.value = value;
    getSearchResult();
  }

  defineExpose({
    open,
  });
</script>

<template>
  <n-drawer
    v-model:show="activeRef"
    close-on-esc
    width="100%"
    to="#layout-body"
    display-directive="show"
    class="searchResultPanel"
    :z-index="1999"
  >
    <n-drawer-content :native-scrollbar="false">
      <template #header>
        <n-page-header :title="`“${searchValRef}”的搜索结果`" @back="handleBack"></n-page-header>
      </template>
      <template #default>
        <n-back-top style="z-index: 1999" />
        <n-grid v-if="searchResultRef.length" x-gap="12" y-gap="8" cols="1 750:2 1200:4">
          <n-gi v-for="(item, index) in searchResultRef" :key="index" style="width: 100%">
            <search-item
              :title="item.title"
              :image="item.img || item.pic_url"
              :description="item.desc"
              :content="item.content"
              :rule-title="searchRuleRef ? searchRuleRef.title : ''"
              @click="handleClick(item)"
            ></search-item>
          </n-gi>
        </n-grid>
        <n-empty
          v-else-if="!loadingRef"
          description="没有解析到资源，换个小程序看看吧"
          size="huge"
        />
        <div v-if="isPage" class="searchResultPanel__loadMore">
          <n-button :loading="loadingRef" @click="loadMore">加载更多</n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<style>
  .searchResultPanel__loadMore {
    text-align: center;
    padding: 12px 0;
  }
</style>
