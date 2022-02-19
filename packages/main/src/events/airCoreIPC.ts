import {
  AIR_GET_CONFIG,
  AIR_OPEN_FILE,
  AIR_SAVE_CONFIG,
  GET_FILE_CONTENT,
  IMPORT_BACKUP,
  WEBDAV_SYNC,
} from '#/events/constants';
import { ipcMain, IpcMainEvent, shell, IpcMainInvokeEvent } from 'electron';
import air from '/@/apis/core/air';
import path from 'path';
import fs from 'fs-extra';
import dav from '/@/apis/core/air/dav';
import { dbPathChecker } from '/@/apis/core/datastore/dbChecker';
import { importBackup } from '/@/apis/core/utils';

const STORE_PATH = path.dirname(dbPathChecker());

const handleAirSaveConfig = () => {
  ipcMain.on(AIR_SAVE_CONFIG, (event: IpcMainEvent, data: IObj) => {
    air.saveConfig(data);
  });
};

const handleAirGetConfig = () => {
  ipcMain.on(AIR_GET_CONFIG, (event: IpcMainEvent, key: string | undefined, callbackId: string) => {
    console.log(air);
    const result = air.getConfig(key);
    event.sender.send(AIR_GET_CONFIG, result, callbackId);
  });
};

const handleGetFileContent = () => {
  ipcMain.on(GET_FILE_CONTENT, (event: IpcMainEvent, fileName: string, callbackId: string) => {
    const abFilePath = path.join(STORE_PATH, fileName);
    if (fs.existsSync(abFilePath)) {
      const content = fs.readFileSync(abFilePath).toString();
      event.sender.send(GET_FILE_CONTENT, content, callbackId);
    } else {
      event.sender.send(GET_FILE_CONTENT, '', callbackId);
    }
  });
};

const handleWebdav = () => {
  ipcMain.handle(WEBDAV_SYNC, async () => {
    const result = await dav.sync();
    return result;
  });
};

const handleOpenFile = () => {
  ipcMain.on(AIR_OPEN_FILE, (event: IpcMainEvent, fileName: string) => {
    const abFilePath = path.join(STORE_PATH, fileName);
    shell.openPath(abFilePath);
  });
};

const handleAirImport = () => {
  ipcMain.handle(IMPORT_BACKUP, async (event: IpcMainInvokeEvent, filePath: string) => {
    return importBackup(filePath);
  });
};

export default {
  listen() {
    handleAirSaveConfig();
    handleAirGetConfig();
    handleGetFileContent();
    handleWebdav();
    handleOpenFile();
    handleAirImport();
  },
};
