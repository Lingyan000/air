<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ApiDocumentIndex',
  });
</script>

<template>
  <div class="apiDocument">
    <webview src="http://localhost:52020/docs/api" />
  </div>
</template>

<style>
  .apiDocument {
    width: 100%;
  }

  .apiDocument webview {
    width: 100%;
    min-height: calc(100vh - var(--header-height));
  }
</style>
