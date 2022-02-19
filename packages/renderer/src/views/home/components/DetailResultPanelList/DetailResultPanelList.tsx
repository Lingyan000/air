import { defineComponent, nextTick, ref } from 'vue';
import DetailResultPanel from '/@/views/home/components/DetailResultPanel/DetailResultPanel.vue';

export default defineComponent({
  name: 'DetailResultPanelList',

  emits: ['clickItem'],

  setup(props, { emit }) {
    const detailResultPanelList = ref<any[]>([]);

    function close() {
      detailResultPanelList.value.pop();
    }

    function add() {
      const detailResultPanel: any = (
        <DetailResultPanel
          onClickItem={(id, item) => {
            emit('clickItem', id, item);
          }}
          onClose={close}
        />
      );

      detailResultPanelList.value.push(detailResultPanel);

      return nextTick().then(() => {
        return detailResultPanel;
      });
    }

    function refresh() {
      detailResultPanelList.value[
        detailResultPanelList.value.length - 1
      ].component.exposed.refresh();
    }

    return {
      add,
      close,
      refresh,
      detailResultPanelList,
    };
  },

  render() {
    return <>{this.detailResultPanelList}</>;
  },
});
