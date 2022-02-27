import { protocol } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { URL } from 'url';
import air from '/@/apis/core/air';
// import * as queryString from 'querystring';

export default () => {
  protocol.registerHttpProtocol('air', (req, cb) => {
    let url = req.url.replace('air://', '');
    // let paramsStr;
    // eslint-disable-next-line prefer-const
    let referrer: string | undefined = undefined;
    if (url.includes('@Referer=')) {
      referrer = url.split('@Referer=')[1].split('@')[0];
    }
    if (url.includes('@User-Agent=')) {
      req.headers['user-agent'] = url.split('@User-Agent=')[1].split('@')[0];
    }
    if (url.includes('@Cookie=')) {
      req.headers['cookie'] = url.split('@Cookie=')[1].split('@')[0];
    }
    url = url.replace(/@User-Agent=.*|@Referer=.*|@Cookie=.*/g, '');
    // [url, ...paramsStr] = url.split('@');
    // paramsStr = paramsStr.join('@');
    // const params = paramsStr ? queryString.parse(paramsStr, '@') : {};
    // if (params.headers) {
    //   try {
    //     req.headers = { ...req.headers, ...JSON.parse(<string>params.headers) };
    //   } catch (e) {}
    // }
    cb({
      headers: req.headers,
      url,
      referrer: referrer || url,
    });
  });

  protocol.registerBufferProtocol('airr', (req, respond) => {
    let pathName = '../../' + new URL(req.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    fs.readFile(path.join(__dirname, pathName), (error, data) => {
      if (error) {
        air.log.error(`Failed to read ${pathName} on airr protocol`, error);
        console.error(`Failed to read ${pathName} on airr protocol`, error);
      }
      const extension = path.extname(pathName).toLowerCase();
      let mimeType = '';

      if (extension === '.js') {
        mimeType = 'text/javascript';
      } else if (extension === '.html') {
        mimeType = 'text/html';
      } else if (extension === '.css') {
        mimeType = 'text/css';
      } else if (extension === '.svg' || extension === '.svgz') {
        mimeType = 'image/svg+xml';
      } else if (extension === '.json') {
        mimeType = 'application/json';
      } else if (extension === '.wasm') {
        mimeType = 'application/wasm';
      }

      respond({ mimeType, data });
    });
  });
};
