<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    NPageHeader,
    NForm,
    NFormItem,
    NSpace,
    NRadioGroup,
    NRadio,
    NInputGroup,
    NInput,
    NButton,
    NTooltip,
    useMessage,
  } from 'naive-ui';
  import { useDesignSettingStore } from '/@/store/modules/designSetting';
  import { getConfig, saveConfig } from '/@/utils/events-impl';
  import EditWebDavModal from '/@/views/setting/components/EditWebDavModal.vue';
  import LogModal from './components/LogModal.vue';
  import ImportBackupModal from './components/ImportBackupModal.vue';
  import { Sync as SyncIcon } from '@vicons/ionicons5';
  import { WEBDAV_SYNC } from '#/events/constants';

  const message = useMessage();

  const designSetting = useDesignSettingStore();

  const themes = ref([
    {
      label: '明亮',
      value: 'light',
    },
    {
      label: '暗黑',
      value: 'dark',
    },
    {
      label: '跟随系统',
      value: 'system',
    },
  ]);

  const form = ref({
    theme: designSetting.themeMode,
    webdavUrl: '',
  });

  function themeChange(e) {
    saveConfig({
      'settings.themeMode': e.target.value,
    });
    designSetting.setThemeMode(e.target.value);
  }

  const editWebDavModalRef = ref<typeof EditWebDavModal | null>(null);

  function openEditWebDavModal() {
    editWebDavModalRef.value?.open();
  }

  const logModalRef = ref<typeof LogModal | null>(null);

  function openLogModal() {
    logModalRef.value?.open();
  }

  async function setDefaultWebDavUrl() {
    form.value.webdavUrl = (await getConfig('settings.webdav.remoteURL')) || '';
  }

  async function webdavSync() {
    if (!(await getConfig('settings.webdav.remoteURL'))) {
      return message.warning('请先配置 WebDAV 远程地址');
    }
    const msgReactive = message.loading('正在同步...', {
      duration: 0,
    });
    try {
      const res = await window.api.invoke(WEBDAV_SYNC);
      if (res.status === 'success') {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      msgReactive.destroy();
    }
  }

  setDefaultWebDavUrl();

  const importBackupModelRef = ref<typeof ImportBackupModal | null>(null);

  function openImportBackupModal() {
    importBackupModelRef.value?.open();
  }
</script>

<template>
  <div class="setting">
    <n-page-header title="设置" class="setting__header" />
    <div class="setting__content">
      <n-form label-align="left" label-placement="left" :label-width="100">
        <n-form-item label="主题模式">
          <n-radio-group v-model:value="form.theme" name="radiogroup" @change="themeChange">
            <n-space>
              <n-radio v-for="theme in themes" :key="theme.value" :value="theme.value">
                {{ theme.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="WebDav">
          <n-input-group>
            <n-input v-model:value="form.webdavUrl" readonly placeholder="未配置"></n-input>
            <n-tooltip>
              同步
              <template #trigger>
                <n-button type="primary" @click="webdavSync"
                  ><template #icon>
                    <n-icon>
                      <sync-icon />
                    </n-icon> </template
                ></n-button>
              </template>
            </n-tooltip>
            <n-button @click="openEditWebDavModal">配置</n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item label="日志">
          <n-button type="primary" @click="openLogModal">配置</n-button>
        </n-form-item>
        <n-form-item label="导入备份">
          <n-button type="primary" @click="openImportBackupModal">导入</n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
  <!-- webdav 编辑模态 -->
  <edit-web-dav-modal ref="editWebDavModalRef" @update="setDefaultWebDavUrl" />
  <!-- 日志模态 -->
  <log-modal ref="logModalRef" />
  <!-- 导入备份 -->
  <import-backup-modal ref="importBackupModelRef" />
</template>

<style>
  .setting {
    padding-top: 48px;
    min-height: 100%;
    box-sizing: border-box;
  }

  .setting__header {
    height: 40px;
    padding: 0 40px;
    margin-bottom: 28px;
  }
  .setting__content {
    padding: 0 40px 0 45px;
  }
</style>
