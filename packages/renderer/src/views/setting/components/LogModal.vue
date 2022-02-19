<script lang="ts" setup>
  import { computed, h, Ref, ref } from 'vue';
  import { NModal, NSelect, NTag, SelectRenderTag, useMessage } from 'naive-ui';
  import { getConfig, getFileContent, openFile, saveConfig } from '/@/utils/events-impl';
  import { cloneDeep } from 'lodash';

  const message = useMessage();

  const bodyStyle = {
    width: '600px',
  };

  const showModal = ref(false);

  function open() {
    showModal.value = true;
    getConfig('settings.logLevel').then((res: any) => {
      form.value.logLevel = initLogLevel(res);
    });
  }

  const log: Ref<string> = ref('');

  getFileContent('air.log').then((res) => {
    log.value = res;
  });

  const renderTag: SelectRenderTag = ({ option, handleClose }) => {
    return h(
      NTag as any,
      {
        type: option.type as 'success' | 'warning' | 'error' | 'info' | '',
        closable: true,
        onClose: (e: MouseEvent) => {
          e.stopPropagation();
          handleClose();
        },
      },
      { default: () => option.label }
    );
  };

  const form = ref({
    logLevel: ['all'],
  });

  const options = computed(() => {
    return [
      {
        label: '全部-All',
        value: 'all',
        disabled: form.value.logLevel.some((item) =>
          ['none', 'success', 'warning', 'error', 'info'].includes(item)
        ),
      },
      {
        label: '成功-Success',
        value: 'success',
        type: 'success',
        disabled: form.value.logLevel.some((item) => ['none', 'all'].includes(item)),
      },
      {
        label: '提醒-Warning',
        value: 'warning',
        type: 'warning',
        disabled: form.value.logLevel.some((item) => ['none', 'all'].includes(item)),
      },
      {
        label: '错误-Error',
        value: 'error',
        type: 'error',
        disabled: form.value.logLevel.some((item) => ['none', 'all'].includes(item)),
      },
      {
        label: '普通-Info',
        value: 'info',
        type: 'info',
        disabled: form.value.logLevel.some((item) => ['none', 'all'].includes(item)),
      },
      {
        label: '不记录日志-None',
        value: 'none',
        disabled: form.value.logLevel.some((item) =>
          ['all', 'success', 'warning', 'error', 'info'].includes(item)
        ),
      },
    ];
  });

  function initLogLevel(logLevel: string | string[]) {
    if (!Array.isArray(logLevel)) {
      if (logLevel && logLevel.length > 0) {
        logLevel = [logLevel];
      } else {
        logLevel = ['all'];
      }
    }
    return logLevel;
  }

  function saveLogLevelSetting() {
    if (form.value.logLevel.length === 0) {
      return message.error('请选择日志记录等级');
    }
    saveConfig({
      'settings.logLevel': cloneDeep(form.value.logLevel),
    });
    showModal.value = false;
  }

  defineExpose({
    open,
  });
</script>

<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="日志"
    size="huge"
    :style="bodyStyle"
    :bordered="false"
  >
    <n-form abel-align="left" label-placement="left" :label-width="120">
      <n-form-item label="日志文件">
        <n-button type="primary" @click="openFile('air.log')"> 打开 </n-button>
      </n-form-item>
      <n-form-item label="日志记录等级">
        <n-select
          v-model:value="form.logLevel"
          multiple
          :render-tag="renderTag"
          :options="options"
          :max-tag-count="2"
        />
      </n-form-item>
      <!--      <n-log ref="logInst" :log="log" language="logs" trim />-->
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div class="tw-flex tw-flex-row-reverse">
            <n-button round type="primary" @click="saveLogLevelSetting"> 保存 </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>
