import { contextBridge, shell, ipcRenderer } from 'electron';
import sanitizeHtml from 'sanitize-html';

import type { BinaryLike } from 'crypto';
import { createHash } from 'crypto';
import * as path from 'path';
const http = require('axios/lib/adapters/http');

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * Expose Environment versions.
 * @example
 * console.log( window.versions )
 */
contextBridge.exposeInMainWorld('versions', process.versions);

/**
 * Safe expose node.js API
 * @example
 * window.nodeCrypto('data')
 */
contextBridge.exposeInMainWorld('nodeCrypto', {
  sha256sum(data: BinaryLike) {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  },
});

/**
 * Safe expose node.js API
 * axios.defaults.adapter = http
 */
contextBridge.exposeInMainWorld('http', http);

contextBridge.exposeInMainWorld(
  'preloadPath',
  path.join(__dirname, '../../preload/dist/index.cjs')
);

/**
 * 打开浏览器
 */
contextBridge.exposeInMainWorld('openBrowser', (url: string) => {
  shell.openExternal(url);
});

contextBridge.exposeInMainWorld('api', {
  send: (channel, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
  sendSync: (channel, ...args: any[]) => {
    ipcRenderer.sendSync(channel, ...args);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args: any[]) => func(event, ...args));
  },
  invoke: (channel, ...args: any[]): Promise<any> => {
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args: any[]) => func(event, ...args));
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, listener);
  },
});

contextBridge.exposeInMainWorld('log', (...args: any[]) => {
  console.log(...args);
});

contextBridge.exposeInMainWorld('sanitizeHtml', {
  sanitizeHtml: sanitizeHtml,
  defaults: sanitizeHtml.defaults,
});
