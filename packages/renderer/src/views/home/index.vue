<script lang="ts" setup>
  import { homeInjectionKey } from './interface';
  import { ref, provide } from 'vue';
  import RuleSearch from '/@/views/home/components/RuleSearch';
  import Logo from '/@/views/home/components/Logo.vue';
  import { getArticlelistruleList } from '/@/api/articlelistrule';
  import { useArtilelistruleStore } from '/@/store/modules/artilelistrule';
  import * as Models from '#/models';
  import ImportRule from '/@/views/home/components/ImportRule/ImportRule.vue';
  import { useAir } from '/@/components/AirProvider';
  import tb from 'ts-toolbelt';

  const air = useAir();

  const artilelistruleStore = useArtilelistruleStore();

  const { openBrowser } = window;

  const showRuleDrawer = ref(false);
  const activeName = ref<string | undefined>(undefined);
  const ruleList = ref<Models.Articlelistrules>([]);

  /**
   * 获取规则列表
   */
  const getList = () => {
    return getArticlelistruleList().then((res) => {
      artilelistruleStore.initArtilelistrule(res);
      ruleList.value = res;
      if (ruleList.value.length > 0) {
        activeName.value = ruleList.value[0].title;
      }
    });
  };

  /**
   * 搜索
   * @param rule
   * @param value
   */
  const handleSearch = (rule: tb.Object.Optional<Models.Articlelistrule>, value: string) => {
    // 判断规则是否含有搜索解析代码
    if (rule.searchfind) {
      air.showSearchPanel(rule, value);
    } else {
      rule.search_url && openBrowser(rule.search_url.replace('**', value));
    }
  };

  function sucessImport() {
    getList();
  }

  provide(homeInjectionKey, {
    activeNameRef: activeName,
    ruleListRef: ruleList,
    showRuleDrawerRef: showRuleDrawer,
  });

  getList();
</script>

<template>
  <div id="home" class="home">
    <!-- Logo-->
    <logo />
    <!-- 搜索框 -->
    <rule-search @search="handleSearch" />
  </div>
  <import-rule @sucess="sucessImport" />
</template>

<style>
  .home {
    width: 100%;
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home .n-tabs-nav {
    margin: 0 20px;
  }
</style>
