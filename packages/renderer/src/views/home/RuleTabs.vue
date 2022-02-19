<script lang="ts" setup>
  import { NTabs, NTabPane, NIcon } from 'naive-ui';
  import { inject, ref } from 'vue';
  import { homeInjectionKey } from './interface';
  import { ChevronDown } from '@vicons/ionicons5';

  const nTabsRef = ref(null);

  const { showRuleDrawerRef, ruleListRef, activeNameRef } = inject(homeInjectionKey)!;

  function showRuleDrawer() {
    showRuleDrawerRef.value = true;
  }
</script>

<template>
  <n-tabs
    v-if="ruleListRef.length"
    ref="nTabsRef"
    v-model:value="activeNameRef"
    type="line"
    pane-style="height: calc(var(--height) - 41.96px - 12px);"
  >
    <template #default>
      <n-tab-pane
        v-for="item in ruleListRef"
        :key="item.id"
        :name="item.title"
        :tab="item.title"
      ></n-tab-pane>
    </template>
    <template #suffix>
      <div style="cursor: pointer; font-size: 18px; line-height: 0" @click="showRuleDrawer">
        <n-icon>
          <chevronDown />
        </n-icon>
      </div>
    </template>
  </n-tabs>
</template>

<style></style>
