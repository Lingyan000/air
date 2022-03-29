<script lang="ts" setup>
  import { Ref, ref } from 'vue';
  import { NElement, NIcon, NTooltip, NP, NRow, NCol, NButton, NSpace, useMessage } from 'naive-ui';
  import { Download as DownloadIcon } from '@vicons/ionicons5';
  import { importRule } from '/@/api/articlelistrule';

  const emit = defineEmits<{
    (e: 'sucess'): void;
  }>();

  const message = useMessage();

  const showModalRef: Ref<boolean> = ref(false);

  const ruleRef: Ref<string> = ref('');

  const loadingRef: Ref<boolean> = ref(false);

  function confirm() {
    loadingRef.value = true;
    importRule({
      password: ruleRef.value,
    })
      .then((res) => {
        if ((['home_rule', 'home_rule_v2'] as PasswordSignType[]).includes(res.type)) {
          message.success(`成功导入✨${res.data.title}✨`);
        } else if (res.type == 'home_rule_url') {
          message.success(`成功导入${res.data.length}条规则`);
        }
        showModalRef.value = false;
        emit('sucess');
      })
      .finally(() => {
        loadingRef.value = false;
      });
  }
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-element class="homeImportRule__button" @click="showModalRef = true">
        <n-icon>
          <download-icon />
        </n-icon>
      </n-element>
    </template>
    导入规则
  </n-tooltip>
  <n-modal
    v-model:show="showModalRef"
    title="剪贴板口令导入"
    preset="card"
    class="homeImportRule__modal"
  >
    <n-space vertical>
      <n-p class="tw-text-center">支持云剪贴板口令和海阔视界标识开头的口令</n-p>
      <n-input
        v-model:value="ruleRef"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" :loading="loadingRef" @click="confirm"> 确定 </n-button>
          </div>
        </n-col>
      </n-row>
    </n-space>
  </n-modal>
</template>

<style>
  .homeImportRule__button {
    position: fixed;
    z-index: 10;
    bottom: 40px;
    right: 40px;
    width: 44px;
    height: 44px;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--popover-color);
    color: var(--text-color-2);
    transition: all 0.3s var(--cubic-bezier-ease-in-out);
    box-shadow: rgb(0 0 0 / 12%) 0px 2px 8px 0px;
    cursor: pointer;
  }

  .homeImportRule__modal {
    width: 400px;
  }
</style>
