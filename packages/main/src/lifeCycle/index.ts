import { app, BrowserWindow, shell, Notification } from 'electron';
import ipcList from '/@/events/ipcList';
import { URL } from 'url';
import { IWindowList } from '#/types/enum';
import windowManager from '/@/apis/app/window/windowManager';
import { Server } from '/@/server';
import createProtocol from '/@/lifeCycle/createProtocol';
import { protocol } from 'electron';
import { importHikerFile } from '/@/apis/core/utils';
import { setDefaultHeaders } from '/@/utils';

const isDevelopment = import.meta.env.MODE === 'development';

app.disableHardwareAcceleration();

const mainWindow: BrowserWindow | null = null;

class LifeCycle {
  private async beforeReady() {
    if (process.argv.length > 1) {
      const path = process.argv[1];
      importHikerFile(path);
    }
    protocol.registerSchemesAsPrivileged([
      { scheme: 'airr', privileges: { secure: true, standard: true } },
    ]);
    global.airServer = new Server();
    await global.airServer.start();
    ipcList.listen();
  }

  private onReady() {
    const readyFunction = async () => {
      createProtocol();

      // Install "Vue.js devtools"
      if (isDevelopment) {
        import('electron-devtools-installer')
          .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
            installExtension(VUEJS3_DEVTOOLS, {
              loadExtensionOptions: {
                allowFileAccess: true,
              },
            })
          )
          .catch((e) => console.error('Failed install extension:', e));
      }

      // Auto-updates
      if (import.meta.env.PROD) {
        import('electron-updater')
          .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
          .catch((e) => console.error('Failed check updates:', e));
      }

      try {
        windowManager.create(IWindowList.MAIN_WINDOW);
      } catch (e) {
        console.error('Failed create window:', e);
      }

      if (global.notificationList && global.notificationList?.length > 0) {
        while (global.notificationList?.length) {
          const option = global.notificationList.pop();
          const notice = new Notification(option!);
          notice.show();
        }
      }

      setDefaultHeaders();

      // dav.sync();
    };
    if (!app.isReady()) {
      app.on('ready', readyFunction);
    } else {
      readyFunction();
    }
  }

  private onRunning() {
    app.on('web-contents-created', (_event, contents) => {
      /**
       * Block navigation to origins not on the allowlist.
       *
       * Navigation is a common attack vector. If an attacker can convince the app to navigate away
       * from its current page, they can possibly force the app to open web sites on the Internet.
       *
       * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
       */
      contents.on('will-navigate', (event, url) => {
        const allowedOrigins: ReadonlySet<string> = new Set<`https://${string}`>(); // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
        const { origin, hostname } = new URL(url);
        const isDevLocalhost = isDevelopment && hostname === 'localhost'; // permit live reload of index.html
        if (!allowedOrigins.has(origin) && !isDevLocalhost) {
          console.warn('Blocked navigating to an unallowed origin:', origin);
          event.preventDefault();
        }
      });

      /**
       * Hyperlinks to allowed sites open in the default browser.
       *
       * The creation of new `webContents` is a common attack vector. Attackers attempt to convince the app to create new windows,
       * frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.
       * You should deny any unexpected window creation.
       *
       * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
       * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content
       */
      contents.setWindowOpenHandler(({ url }) => {
        const allowedOrigins: ReadonlySet<string> = new Set<`https://${string}`>([
          // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
          'https://vitejs.dev',
          'https://github.com',
          'https://v3.vuejs.org',
        ]);
        const { origin } = new URL(url);
        if (allowedOrigins.has(origin)) {
          shell.openExternal(url);
        } else {
          console.warn('Blocked the opening of an unallowed origin:', origin);
        }
        return { action: 'deny' };
      });
    });

    app.on('second-instance', (event, argv) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
      if (argv.length > 2) {
        const path = argv[2];
        importHikerFile(path);
      }
    });

    app.on('open-file', async (event, path) => {
      if (path.endsWith('.hiker')) {
        importHikerFile(path);
      }
    });
  }

  private onQuit() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  async launchApp() {
    const isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      app.quit();
      process.exit(0);
    } else {
      await this.beforeReady();
      this.onReady();
      this.onRunning();
      this.onQuit();
    }
  }
}

const bootstrap = new LifeCycle();

export { bootstrap };
