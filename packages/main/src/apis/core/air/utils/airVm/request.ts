import AirVm, { FetchConfig } from '/@/apis/core/air/utils/airVm/index';
import { URL } from 'url';
import { join } from 'path';
import fs, { readFileSync } from 'fs-extra';
import { cloneDeep } from 'lodash';
import { createSyncFn } from 'sync-threads';
import { addOrUpdateRequireData, getRequireData } from '/@/apis/core/air/utils/require';
import dayjs from 'dayjs';
import validator from 'validator';
import isJSON = validator.isJSON;

export default (airVm: AirVm) => {
  function fetch(reqUrl: string, config: FetchConfig = {}) {
    try {
      if (reqUrl.startsWith('hiker://')) {
        const url = new URL(reqUrl);
        switch (url.host) {
          case 'page':
            const page = airVm.context.pages.find((page) => page.path === url.pathname.slice(1));
            if (!page) throw new Error('page not found');
            return JSON.stringify(page);
          case 'files':
            const filePath = join(airVm.documentsDir, decodeURIComponent(url.pathname));
            if (!fs.existsSync(filePath)) return '';
            return readFileSync(filePath).toString();
          case 'home':
            return JSON.stringify(airVm.context.home);
        }
        return;
      }
      const syncFetch = createSyncFn(require.resolve('./worker/fetch'), 1024 * 1024);
      return syncFetch({ url: reqUrl, config: cloneDeep(config) });
    } catch (e) {
      console.error(e);
    }
  }

  function fetchCanhe(
    url: string,
    hour: number,
    data = {
      headers: {},
    },
    version = 0
  ) {
    const fileName = airVm.md5(url);
    const configPath = join(airVm.documentsDir, './libs/' + fileName + '.json');
    const filePath = join(airVm.documentsDir, './libs/' + fileName + '.js');
    const requirePath = airVm.requirePath;
    if (!fs.existsSync(configPath)) {
      fs.ensureFileSync(configPath);
      const content = JSON.stringify({
        version,
        url,
      });
      fs.writeFileSync(configPath, content);
    }

    // 升级版本号
    const configTxt = fs.readFileSync(configPath, 'utf-8');
    if (isJSON(configTxt)) {
      const config = JSON.parse(configTxt);
      if (config.version != version) {
        fs.rmSync(configPath);
        config.version = version;
        fs.writeFileSync(configPath, JSON.stringify(config));
      }
    }

    // 写入依赖文件
    function writeDependFile() {
      const content = fetch(url, {
        headers: data.headers,
      });
      fs.ensureFileSync(filePath);
      fs.writeFileSync(filePath, content);
      addOrUpdateRequireData(requirePath, url, filePath);
    }

    if (!fs.existsSync(filePath)) {
      writeDependFile();
    } else if (hour) {
      // 检查是否过期
      const data = getRequireData(requirePath);
      const index = data.findIndex((item) => item.url === url);
      if (index === -1 || dayjs(data[index].accessTime).add(hour, 'hour').isBefore(dayjs())) {
        fs.rmSync(filePath);
        writeDependFile();
      }
    }
    return fs.readFileSync(filePath).toString();
  }

  function fetchCookie(url, config: FetchConfig) {
    const syncFetch = createSyncFn(require.resolve('./worker/fetchCookie'), 1024 * 1024);
    return syncFetch({ url: url, config: cloneDeep(config) });
  }

  return {
    fetch,

    fetchCookie,

    request: fetch,

    batchFetch(params: { url: string; options: any }[]) {
      return params.map(({ url, options }) => fetch(url, options));
    },

    fetchCanhe,

    fc: fetchCanhe,
  };
};
