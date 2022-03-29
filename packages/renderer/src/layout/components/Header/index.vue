<script lang="ts" setup>
  import { ref } from 'vue';
  import { NIcon, NButton, NDropdown } from 'naive-ui';
  import { PersonCircleOutline as PersonCircleOutlineIcon } from '@vicons/ionicons5';
  import 'vscode-codicons/dist/codicon.css';
  import {
    CLOSE_WINDOW,
    MINIMIZE_WINDOW,
    MAX_RESTORE_WINDOW,
    IS_MAXIMIZE_WINDOW,
  } from '#/events/constants';
  import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
  import { useAir } from '/@/components/AirProvider';

  const air = useAir();

  const { api } = window;

  const isMaximize = ref(false);

  if (api) {
    api.on('window-unmaximize', () => {
      isMaximize.value = false;
    });

    api.on('window-maximize', () => {
      isMaximize.value = true;
    });
  }

  const userMenuOptions: DropdownMixedOption[] = [
    {
      label: '️历史记录',
      key: 'history',
    },
  ];

  async function setDefaultMaximize() {
    isMaximize.value = await api.invoke(IS_MAXIMIZE_WINDOW);
  }

  function minimizeWindow() {
    api.send(MINIMIZE_WINDOW);
  }

  function maxRestoreWindow() {
    api.send(MAX_RESTORE_WINDOW);
  }

  function closeWindow() {
    api.send(CLOSE_WINDOW);
  }

  function onDropDownSelect(key: string) {
    if (key === 'history') {
      air?.showViewHistory();
    }
  }

  setDefaultMaximize();
</script>

<template>
  <n-layout-header class="layout-header" inverted>
    <div class="layout-header__drag-region"></div>
    <n-text tag="div" class="layout-header__title">空气</n-text>
    <div class="layout-header__controls">
      <n-text class="layout-dropdown-container">
        <n-dropdown
          :options="userMenuOptions"
          placement="bottom-start"
          trigger="click"
          @select="onDropDownSelect"
        >
          <n-button
            quaternary
            round
            tag="div"
            style="padding: 0; height: auto; width: auto; --n-icon-size: 22px"
          >
            <template #icon>
              <n-icon>
                <person-circle-outline-icon />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </n-text>
      <n-button
        quaternary
        class="window-icon window-minimize codicon codicon-chrome-minimize"
        style="--color-focus: unset; --text-color-focus: var(--text-color)"
        :focusable="false"
        @click="minimizeWindow"
      ></n-button>
      <n-button
        quaternary
        class="window-icon window-max-restore codicon"
        :class="isMaximize ? 'codicon-chrome-restore' : 'codicon-chrome-maximize'"
        style="--color-focus: unset; --text-color-focus: var(--text-color)"
        :focusable="false"
        @click="maxRestoreWindow"
      ></n-button>
      <n-button
        quaternary
        class="window-icon window-close codicon codicon codicon-chrome-close"
        :focusable="false"
        style="
          --n-color-hover: rgba(232, 17, 35, 0.9);
          --n-text-color-hover: rgba(255, 255, 255, 0.82);
          --n-color-pressed: rgba(232, 17, 35, 0.75);
          --n-text-color-pressed: rgba(255, 255, 255, 0.82);
        "
        @click="closeWindow"
      ></n-button>
    </div>
  </n-layout-header>
</template>

<style>
  .layout-header {
    height: var(--header-height);
    display: grid;
    grid-auto-rows: var(--header-height);
    grid-template-columns: 1fr auto;
    position: relative;
  }

  .layout-header__drag-region {
    top: 0;
    left: 0;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
  }

  .layout-header__title {
    font-family: Segoe UI, Microsoft YaHei UI, Microsoft YaHei, sans-serif;
    font-size: 12px;
    padding: 8px;
  }

  .layout-header__controls {
    -webkit-app-region: no-drag;
    height: 100%;
    margin-left: auto;
    justify-content: flex-end;
    display: flex;
  }

  .window-icon {
    height: 100%;
    cursor: default;
  }

  .layout-dropdown-container {
    min-width: 46px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
