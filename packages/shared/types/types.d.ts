// global
interface IObj {
  [propName: string]: any;
}

// Main process
interface IBrowserWindowOptions {
  height: number;
  width: number;
  show: boolean;
  fullscreenable: boolean;
  resizable: boolean;
  webPreferences: {
    webviewTag: boolean;
    nodeIntegrationInWorker: boolean;
    contextIsolation: boolean;
    backgroundThrottling: boolean;
    webSecurity?: boolean;
  };
  vibrancy?: string | any;
  frame?: boolean;
  center?: boolean;
  title?: string;
  titleBarStyle?: string | any;
  backgroundColor?: string;
  autoHideMenuBar?: boolean;
  transparent?: boolean;
  icon?: string;
  skipTaskbar?: boolean;
  alwaysOnTop?: boolean;
}

type ILogArgvType = string | number;

type ILogArgvTypeWithError = ILogArgvType | Error;
