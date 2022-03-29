import { MAIN_WINDOW_URL } from '/@/apis/app/window/constants';
import { IWindowList } from '#/types/enum';
import { join } from 'path';
import air from '/@/apis/core/air';
import { nativeTheme } from 'electron';
import windowStateKeeper from 'electron-window-state';

const windowList = new Map<IWindowList, IWindowListItem>();
const isDevelopment = import.meta.env.MODE === 'development';

const minWidth = 800;
const minHeight = 600;

let savedWindowState: windowStateKeeper.State | null = null;

windowList.set(IWindowList.MAIN_WINDOW, {
  isValid: true,
  multiple: false,
  options() {
    savedWindowState = windowStateKeeper({
      defaultWidth: minWidth,
      defaultHeight: minHeight,
      maximize: false,
    });

    const options: Electron.BrowserWindowConstructorOptions = {
      x: savedWindowState.x,
      y: savedWindowState.y,
      width: savedWindowState.width,
      height: savedWindowState.height,
      minHeight: minHeight,
      minWidth: minWidth,
      show: false,
      frame: true,
      center: true,
      title: '空气',
      transparent: true,
      titleBarStyle: 'hidden',
      webPreferences: {
        webSecurity: false,
        webviewTag: true,
        nativeWindowOpen: true,
        preload: join(__dirname, '../../preload/dist/index.cjs'),
      },
    };

    let backgroundColor = '#fff';
    try {
      let theme = air.getConfig('settings.themeMode');
      if (theme === 'system') {
        theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        backgroundColor = '#101014';
      } else {
        backgroundColor = '#fff';
      }
    } catch (e) {}

    if (process.platform !== 'darwin') {
      options.show = false;
      options.frame = false;
      options.backgroundColor = backgroundColor;
      options.transparent = false;
      options.icon = './icon.ico';
    }
    return options;
  },
  callback(window) {
    savedWindowState?.manage(window);

    window.on('ready-to-show', () => {
      if (savedWindowState?.isMaximized) {
        window.maximize();
      }

      window?.show();

      if (isDevelopment) {
        window?.webContents.openDevTools();
      }
    });
    window.loadURL(MAIN_WINDOW_URL);
  },
});

export default windowList;
