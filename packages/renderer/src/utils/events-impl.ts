import {
  AIR_GET_CONFIG,
  AIR_OPEN_FILE,
  AIR_SAVE_CONFIG,
  GET_FILE_CONTENT,
} from '#/events/constants';
import { nanoid } from 'nanoid';
import type { IpcRendererEvent } from 'electron';

const { api } = window;

export function saveConfig(config: IObj | string, value?: any) {
  if (typeof config === 'string') {
    config = {
      [config]: value,
    };
  }
  api.send(AIR_SAVE_CONFIG, config);
}

export function getConfig<T>(key?: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    const callbackId = nanoid();
    const callback = (event: IpcRendererEvent, config: T | undefined, returnCallbackId: string) => {
      if (returnCallbackId === callbackId) {
        resolve(config);
        api.removeListener(AIR_GET_CONFIG, callback);
      }
    };
    api.on(AIR_GET_CONFIG, callback);
    api.send(AIR_GET_CONFIG, key, callbackId);
  });
}

export function getFileContent(fileNmae: string): Promise<string> {
  return new Promise((resolve) => {
    const callbackId = nanoid();
    const callback = (event: IpcRendererEvent, content: string, returnCallbackId: string) => {
      if (returnCallbackId === callbackId) {
        resolve(content);
        api.removeListener(GET_FILE_CONTENT, callback);
      }
    };
    api.on(GET_FILE_CONTENT, callback);
    api.send(GET_FILE_CONTENT, fileNmae, callbackId);
  });
}

export function openFile(file: string) {
  api.send(AIR_OPEN_FILE, file);
}
