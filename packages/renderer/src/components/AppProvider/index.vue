<script lang="ts" setup>
  import MessageContent from '/@/components/MessageContent/index.vue';
  import { AirProvider } from '/@/components/AirProvider';
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <air-provider>
            <message-content />
            <slot />
          </air-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>
