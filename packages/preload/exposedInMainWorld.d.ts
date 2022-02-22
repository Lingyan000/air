interface Window {
  /**
   * Expose Environment versions.
   * @example
   * console.log( window.versions )
   */
  readonly versions: NodeJS.ProcessVersions;
  /**
   * Safe expose node.js API
   * @example
   * window.nodeCrypto('data')
   */
  readonly nodeCrypto: { sha256sum(data: import('crypto').BinaryLike): string };
  /**
   * Safe expose node.js API
   * axios.defaults.adapter = http
   */
  readonly http: any;
  readonly preloadPath: string;
  /** 打开浏览器 */
  readonly openBrowser: (url: string) => void;
  readonly api: {
    send: (channel: any, ...args: any[]) => void;
    sendSync: (channel: any, ...args: any[]) => void;
    receive: (channel: any, func: any) => void;
    invoke: (channel: any, ...args: any[]) => Promise<any>;
    on: (channel: any, func: any) => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
  };
  readonly log: (...args: any[]) => void;
  readonly sanitizeHtml: { sanitizeHtml: any; defaults: any };
}
