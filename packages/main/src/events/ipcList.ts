import airCoreIPC from '/@/events/airCoreIPC';
import { ipcMain, BrowserWindow, session, Notification } from 'electron';
import {
  CLOSE_WINDOW,
  IS_MAXIMIZE_WINDOW,
  MAX_RESTORE_WINDOW,
  MINIMIZE_WINDOW,
  UPDATE_REQUEST_HEADERS,
} from '#/events/constants';

export default {
  listen() {
    airCoreIPC.listen();

    ipcMain.on(MINIMIZE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow();
      window?.minimize();
    });

    ipcMain.handle(IS_MAXIMIZE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow();
      const result = window?.isMaximized();
      return result;
    });

    ipcMain.on(MAX_RESTORE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow();
      const isMaximized = window?.isMaximized();
      isMaximized ? window?.unmaximize() : window?.maximize();
    });

    ipcMain.on(CLOSE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow();
      if (process.platform === 'linux') {
        window?.hide();
      } else {
        window?.close();
      }
    });

    ipcMain.on(UPDATE_REQUEST_HEADERS, (event, filter, headers) => {
      try {
        session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
          Object.keys(headers).forEach((key) => {
            details.requestHeaders[key] = headers[key];
          });
          const requestHeaders = { requestHeaders: details.requestHeaders };
          callback(requestHeaders);
        });
      } catch (e: any) {
        const notification = new Notification({
          title: '错误',
          body: '糟糕...发生了一些错误，可能是 headers 有误',
        });
        notification.show();
        throw new Error(e);
      }
    });
  },
  dispose() {},
};
