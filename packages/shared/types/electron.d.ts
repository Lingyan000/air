// https://stackoverflow.com/questions/45420448/how-to-import-external-type-into-global-d-ts-file
declare type BrowserWindow = import('electron').BrowserWindow;
declare type IWindowList = import('./enum').IWindowList;

declare interface IWindowListItem {
  isValid: boolean;
  multiple: boolean;
  options: () => Electron.BrowserWindowConstructorOptions;
  callback: (window: BrowserWindow, windowManager: IWindowManager) => void;
}

declare interface IWindowManager {
  create: (name: IWindowList) => BrowserWindow | null;
  get: (name: IWindowList) => BrowserWindow | null;
  has: (name: IWindowList) => boolean;
  // delete: (name: IWindowList) => void
  deleteById: (id: number) => void;
  getAvailableWindow: () => BrowserWindow;
}
