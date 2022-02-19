<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMessage } from 'naive-ui';

  export default defineComponent({
    name: 'MessageContent',

    setup() {
      /**
       * 挂载在 window 方便与在js中使用
       * @sse https://github.com/jekip/naive-ui-admin/blob/main/src/components/MessageContent/index.vue
       */
      (window as any).$message = useMessage();
    },
  });
</script>
