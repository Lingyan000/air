<script lang="ts" setup>
  import { NButton, NDrawer, NDrawerContent, NGi, NGrid, NIcon, NSpace } from 'naive-ui';
  import { inject } from 'vue';
  import { homeInjectionKey } from '/@/views/home/interface';
  import { Search as SearchIcon } from '@vicons/ionicons5';

  const { showRuleDrawerRef, ruleListRef, activeNameRef } = inject(homeInjectionKey)!;

  function selectRule(ruleName: string) {
    activeNameRef.value = ruleName;
    showRuleDrawerRef.value = false;
  }
</script>

<template>
  <n-drawer
    v-model:show="showRuleDrawerRef"
    style="border-radius: 0 0 8px 8px"
    placement="top"
    to="#home"
    height="80%"
  >
    <n-drawer-content closable :native-scrollbar="false">
      <template #default>
        <n-grid y-gap="8" x-gap="12" responsive="screen" cols="6 s:4 m:6">
          <n-gi v-for="item in ruleListRef" :key="item.id">
            <n-button
              :type="activeNameRef === item.title ? 'primary' : 'default'"
              ghost
              style="width: 100%"
              @click="selectRule(item.title)"
              >{{ item.title }}
            </n-button>
          </n-gi>
        </n-grid>
      </template>
      <template #header>
        <div style="display: flex; align-items: center">
          <n-space>
            <span style="line-height: 0">我的小程序</span>
            <n-icon>
              <search-icon />
            </n-icon>
          </n-space>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
