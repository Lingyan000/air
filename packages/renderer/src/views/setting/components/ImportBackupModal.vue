<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    NModal,
    NUpload,
    NUploadDragger,
    NIcon,
    NText,
    NP,
    useMessage,
    useDialog,
  } from 'naive-ui';
  import { Archive as ArchiveIcon } from '@vicons/ionicons5';
  import { IMPORT_BACKUP } from '#/events/constants';

  const message = useMessage();
  const dialog = useDialog();

  const bodyStyle = {
    width: 'auto',
  };

  const showModal = ref(false);

  function open() {
    showModal.value = true;
  }

  function customRequest({ file, onFinish }) {
    onFinish();
    if (!(file.type === 'application/x-zip-compressed' || file.type === 'application/zip')) {
      message.error('只能上传zip格式的压缩文件，请重新上传');
      return false;
    }
    dialog.warning({
      title: '警告',
      content: `确定从备份文件（${file.name}）恢复数据吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        window.api.invoke(IMPORT_BACKUP, file.file.path).then((res) => {
          message.info(res.join(','));
        });
        showModal.value = false;
      },
      onNegativeClick: () => {},
    });
  }

  defineExpose({
    open,
  });
</script>

<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    title="导入备份"
    size="huge"
    :style="bodyStyle"
    :bordered="false"
  >
    <n-upload :show-file-list="false" :custom-request="customRequest">
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">点击或者拖动文件到该区域来导入</n-text>
        <n-p depth="3" style="margin: 8px 0 0 0"> 支持的文件类型：zip </n-p>
      </n-upload-dragger>
    </n-upload>
  </n-modal>
</template>
