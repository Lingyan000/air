import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import '/@/styles/global.css';
import { setupStore } from '/@/store';
import { AppProvider } from '/@/components/AppProvider/index';
import { useDesignSettingStore } from '/@/store/modules/designSetting';
import { getConfig } from '/@/utils/events-impl';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

async function bootstrap() {
  const appProvider = createApp(AppProvider);

  const app = createApp(App);

  // 挂载状态管理
  setupStore(app);

  //优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
  appProvider.mount('#AppProvider', true);

  const designSetting = useDesignSettingStore();

  designSetting.setThemeMode(await getConfig<any>('settings.themeMode'));

  app.use(router);

  app.use(VueViewer);

  app.mount('#app', true);
}

void bootstrap();
