import * as webdav from 'webdav';

export interface IAir extends NodeJS.EventEmitter {
  /**
   * air configPath
   *
   * if do not provide, then it will use default configPath
   */
  configPath: string;
  /**
   * the air configPath's baseDir
   */
  baseDir: string;
  /**
   * the air temDir
   */
  tmpDir: string;
  /**
   * air logger factory
   */
  log: ILogger;
  /**
   * air-core version
   */
  VERSION: string;
  /**
   * get air config
   */
  getConfig: <T>(name?: string) => T;
  /**
   * save air config to configPath
   */
  saveConfig: (config: IStringKeyMap<any>) => void;
  /**
   * remove some [propName] in config[key] && save config to configPath
   */
  removeConfig: (key: string, propName: string) => void;
  /**
   * set air config to ctx && will not save to configPath
   */
  setConfig: (config: IStringKeyMap<any>) => void;
  /**
   * unset air config to ctx && will not save to configPath
   */
  unsetConfig: (key: string, propName: string) => void;
}

export interface IDav {
  client: webdav.WebDAVClient;

  sync(): Promise<{
    status: 'success' | 'fail';
    message: string;
  }>;
}

/** Air 配置文件类型定义 */
export interface IConfig {
  debug?: boolean;
  silent?: boolean;
  settings?: {
    themeMode?: string;
    logLevel?: string;
    logPath?: string;
    webdav?: {
      remoteURL: string;
      username?: string;
      password?: string;
    };
  };

  [configOptions: string]: any;
}

export interface IStringKeyMap<T> {
  [key: string]: T extends T ? T : any;
}

export interface ICLIConfigs {
  [module: string]: IStringKeyMap<any>;
}

export type ILogColor = 'blue' | 'green' | 'yellow' | 'red';

export type ILogArgvType = string | number;

export type ILogArgvTypeWithError = ILogArgvType | Error;

export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export interface ILogger {
  success: (...msg: ILogArgvType[]) => void;
  info: (...msg: ILogArgvType[]) => void;
  error: (...msg: ILogArgvTypeWithError[]) => void;
  warn: (...msg: ILogArgvType[]) => void;
}
