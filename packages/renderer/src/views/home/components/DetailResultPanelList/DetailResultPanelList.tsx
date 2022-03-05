import { defineComponent, nextTick, ref } from 'vue';
import DetailResultPanel from '/@/views/home/components/DetailResultPanel/DetailResultPanel.vue';
import { useSocket } from '/@/hooks/socket';
import { REFRESH_PAGE } from '#/events/socket-constants';

export default defineComponent({
  name: 'DetailResultPanelList',

  emits: ['clickItem'],

  setup(props, { emit }) {
    const { socket } = useSocket();

    const detailResultPanelList = ref<any[]>([]);

    function close() {
      detailResultPanelList.value.pop();
    }

    function add() {
      const detailResultPanel: any = (
        <DetailResultPanel
          onClickItem={(id, item, prefix) => {
            emit('clickItem', id, item, prefix);
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

    // 监听刷新页面
    socket.on(REFRESH_PAGE, refresh);

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
