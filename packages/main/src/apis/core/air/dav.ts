import * as webdav from 'webdav';
import air from '/@/apis/core/air/index';
import { FileStat } from 'webdav/dist/node/types';
import { Notification } from 'electron';
import { IDav } from '/@/apis/core/air/types';
import dayjs from 'dayjs';
import { importBackup } from '/@/apis/core/utils';

class Dav implements IDav {
  client: webdav.WebDAVClient;

  constructor() {
    this.client = webdav.createClient(air.getConfig('settings.webdav.remoteURL'), {
      username: air.getConfig('settings.webdav.username'),
      password: air.getConfig('settings.webdav.password'),
    });
  }

  async sync(): Promise<{
    status: 'success' | 'fail';
    message: string;
  }> {
    let status: 'success' | 'fail' = 'success';
    const messageArr: string[] = [];

    try {
      if (!(await this.client.exists('/hiker'))) {
        await this.client.createDirectory('/hiker');
      }
      const directoryItems = (await this.client.getDirectoryContents('/hiker', {
        deep: true,
        glob: '/**/*.zip',
      })) as Array<FileStat>;
      const fileItems = directoryItems
        .filter((item) => item.mime === 'application/zip')
        .sort((a, b) => dayjs(b.lastmod).unix() - dayjs(a.lastmod).unix());
      if (fileItems.length === 0) {
        return {
          status,
          message: '没有需要同步的文件',
        };
      }
      const buff: Buffer = (await this.client.getFileContents(fileItems[0].filename)) as Buffer;
      messageArr.push(...importBackup(buff));
    } catch (error: any) {
      status = 'fail';
      console.error(error);
      air.log.error(error);
      const notification = new Notification({
        title: '同步失败',
        body: error.message,
      });
      notification.show();
      messageArr.push(error.message);
    }

    return {
      status,
      message: messageArr.join(','),
    };
  }
}

export default new Dav();
