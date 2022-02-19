<script lang="ts" setup>
  import { Ref, ref } from 'vue';
  import { NModal, NForm, NFormItem, NInput, useMessage, FormItemRule } from 'naive-ui';
  import { getConfig, saveConfig } from '/@/utils/events-impl';
  import { IConfig } from '../../../../../main/src/apis/core/air/types';

  const emit = defineEmits<{
    (e: 'update'): void;
  }>();

  const message = useMessage();

  const bodyStyle = {
    width: '600px',
  };

  const rules = {
    remoteURL: [
      {
        required: true,
        validator: (rule: FormItemRule, value: any) => {
          if (!value.startsWith('http')) {
            return new Error('WebDav 地址必须以 http 或 https 开头');
          }
        },
        trigger: ['blur'],
      },
      {
        message: 'WebDav 地址必须以 http 或 https 开头',
        trigger: ['blur'],
      },
    ],
  };

  const modelRef = ref({
    remoteURL: '',
    username: '',
    password: '',
  });

  async function setDefaultValue() {
    const setting = await getConfig<IConfig>('settings');
    const { webdav } = setting || {};
    if (webdav) {
      modelRef.value = {
        remoteURL: webdav.remoteURL || '',
        username: webdav.username || '',
        password: webdav.password || '',
      };
    }
  }

  const showModal = ref(false);

  function open() {
    showModal.value = true;
  }

  const formRef: Ref<typeof NForm | null> = ref(null);

  function saveWebDavConifg(e) {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        const webdav = modelRef.value;
        saveConfig({
          'settings.webdav.remoteURL': webdav.remoteURL,
          'settings.webdav.username': webdav.username,
          'settings.webdav.password': webdav.password,
        });
        showModal.value = false;
        message.success('保存成功');
        emit('update');
      }
    });
  }

  setDefaultValue();

  defineExpose({
    open,
  });
</script>

<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    title="WebDav 配置"
    size="huge"
    :style="bodyStyle"
    :bordered="false"
  >
    <n-form
      ref="formRef"
      abel-align="left"
      label-placement="left"
      :model="modelRef"
      :label-width="120"
      :rules="rules"
    >
      <n-form-item label="WebDav 地址" path="remoteURL">
        <n-input v-model:value="modelRef.remoteURL" placeholder="请输入 WebDav 地址" autofocus />
      </n-form-item>
      <n-form-item label="WebDav 用户名" path="username">
        <n-input v-model:value="modelRef.username" placeholder="请输入 WebDav 用户名" />
      </n-form-item>
      <n-form-item label="WebDav 密码" path="password">
        <n-input
          v-model:value="modelRef.password"
          placeholder="请输入 WebDav 密码"
          type="password"
        />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="saveWebDavConifg"> 保存 </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>
