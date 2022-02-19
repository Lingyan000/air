<script lang="ts" setup>
  import { ref, h, resolveComponent } from 'vue';
  import { NLayout } from 'naive-ui';
  import { HomeOutline, SettingsOutline, DocumentOutline } from '@vicons/ionicons5';
  import { renderIcon } from '../utils';
  import { useRoute } from 'vue-router';
  import PageHeader from './components/Header/index.vue';

  const menuOptions = [
    {
      label: () =>
        h(
          resolveComponent('router-link') as any,
          {
            to: {
              name: 'home',
              replace: true,
            },
          },
          {
            default: () => '主页',
          }
        ),
      key: 'home',
      icon: renderIcon(HomeOutline),
    },
    {
      label: () =>
        h(
          resolveComponent('router-link') as any,
          {
            to: {
              name: 'apiDocument',
              replace: true,
            },
          },
          {
            default: () => '接口文档',
          }
        ),
      key: 'apiDocument',
      icon: renderIcon(DocumentOutline),
    },
    {
      label: () =>
        h(
          resolveComponent('router-link') as any,
          {
            to: {
              name: 'setting',
              replace: true,
            },
          },
          {
            default: () => '设置',
          }
        ),
      key: 'setting',
      icon: renderIcon(SettingsOutline),
    },
  ];

  const collapsed = ref(true);

  const route = useRoute();

  const activeKey = ref(route.name as string);
</script>

<template>
  <n-layout position="absolute">
    <page-header />

    <n-layout id="layout-body" has-sider position="absolute" style="top: var(--header-height)">
      <n-layout-sider
        bordere
        inverted
        collapse-mode="width"
        :collapsed-width="64"
        :collapsed="collapsed"
        :width="200"
        show-trigger="bar"
        :native-scrollbar="false"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          inverted
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="20"
          :options="menuOptions"
          mode="vertical"
          :default-value="activeKey"
        />
      </n-layout-sider>
      <n-layout :native-scrollbar="false">
        <router-view />
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style></style>
