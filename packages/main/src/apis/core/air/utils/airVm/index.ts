import cheerio from '/@/utils/custom-cheerio';
import { VM, VMOptions, VMScript } from 'vm2';
import { Headers, Method } from 'got';
import fs, { readFileSync } from 'fs-extra';
import { join } from 'path';
import { isObject, wrap } from 'lodash';
import { isPath, parseDomRes, PrivateJsDecode, PrivateJsEncrypt } from '/@/apis/core/air/utils';
import { URL } from 'url';
import CryptoJS from 'crypto-js';
import { MOBILE_UA, PC_UA } from '#/parse/constants';
import { EventEmitter } from 'events';
import { HIDE_LOADING, REFRESH_PAGE, SHOW_LOADING } from '#/events/socket-constants';
import dayjs from 'dayjs';
import validator from 'validator';
import isJSON = validator.isJSON;
import { addOrUpdateRequireData, getRequireData } from '/@/apis/core/air/utils/require';
import privateFile from './privateFile';
import encoding from '/@/apis/core/air/utils/airVm/encoding';
import request from '/@/apis/core/air/utils/airVm/request';
import { AirVmContext } from '/@/apis/core/air/utils/airVmWorker';

const vmScript = join(__dirname, './vm/script.js');
const vmHikerurl = join(__dirname, './vm/Hikerurl.js');

export type VmType = 'baseIn' | 'homeIn' | 'searchIn' | 'preIn';

export interface AirVmParams {
  rescode?: string | null;
  documentsDir: string;
}

export interface FetchConfig {
  headers?: Headers;
  body?: any;
  method?: Method;
  timeout?: number;
  toHex?: boolean;
}

export default class AirVm extends EventEmitter {
  public rescode: any;
  public vm: VM | undefined;
  public vmType: VmType;
  public sandbox: any;
  public result: any = { data: [] };
  public context: AirVmContext;
  public documentsDir: string;
  public requirePath: string;

  constructor(vmType: VmType, params: AirVmParams, context: AirVmContext, sandbox: any = {}) {
    super();
    this.context = context;
    const { rescode, documentsDir } = params;
    this.documentsDir = documentsDir;
    this.requirePath = join(
      this.documentsDir,
      './rules/files/' + this.context.articlelistrule.title + '/require.json'
    );
    this.vmType = vmType;
    this.rescode = rescode;
    this.sandbox = { ...this.getSandbox(), ...sandbox };
    const options: VMOptions = { sandbox: this.sandbox, eval: true, timeout: 20000 };
    this.vm = new VM(options);
    const script = new VMScript(readFileSync(vmScript) as unknown as string, vmScript);
    this.vm.run(script);
    const hikerurlScript = new VMScript(readFileSync(vmHikerurl) as unknown as string, vmHikerurl);
    this.vm.run(hikerurlScript);
  }

  urlWrap(url: string): string {
    if (this.context.baseUrl) {
      try {
        return new URL(url || '', this.context.baseUrl).href.toString();
      } catch (e) {
        console.error(e);
      }
    }
    return url;
  }

  private getSandbox() {
    switch (this.vmType) {
      case 'homeIn':
        return this.getHomeSandbox();
      case 'searchIn':
        return this.getSearchSandbox();
      case 'baseIn':
        return this.getBaseSandbox();
      case 'preIn':
        return this.getPreSandbox();
    }
  }

  private getBaseSandbox() {
    return {
      MY_PARAMS: {},
      getAppVersion: () => 2820,
      config: this.context.config,
      pd: this.parseDom,
      pdfh: this.parseDomForHtml,
      pdfa: this.parseDomForArray,
      md5: this.md5,
      parseDom: this.parseDom,
      parseDomForHtml: this.parseDomForHtml,
      parseDomForArray: this.parseDomForArray,
      AIR_VARS: this.context.vars,
      AIR_RESULT: this.result,
      AIR_RESCODE: this.rescode,
      writeFile: this.writeFile,
      MY_HOME: this.context.baseUrl,
      MY_URL: this.context.myUrl,
      // eval: this.eval,
      getPrivateJS: this.getPrivateJS,
      evalPrivateJS: this.evalPrivateJS,
      log: this.log,
      CryptoJS: CryptoJS,
      refreshPage: this.refreshPage, // ????????????
      PC_UA: PC_UA,
      MOBILE_UA: MOBILE_UA,
      require: this.require,
      deleteCache: this.deleteCache,
      MY_RULE: this.context.articlelistrule,
      putVar: this.putVar,
      putVar2: this.putVar,
      getVar: this.getVar,
      clearVar: this.clearVar,
      getCryptoJS: this.getCryptoJS,
      setError: this.setError,
      initConfig: this.initConfig,
      requireCache: this.requireCache,
      rc: this.requireCache,
      getMyVar: this.getMyVar,
      putMyVar: this.putMyVar,
      clearMyVar: this.clearMyVar,
      getItem: this.getMyVar, // TODO
      setItem: this.putMyVar, // TODO
      clearItem: this.clearMyVar, // TODO
      confirm: () => {}, // TODO
      setPageTitle: () => {}, // TODO
      setLastChapterRule: this.setLastChapterRule, // TODO
      showLoading: this.showLoading,
      hideLoading: this.hideLoading,
      addListener: this._addListener, // TODO
      getUrl: this.getUrl,
      getPath: this.getPath,
      saveImage: () => {}, // TODO
      ...encoding(),
      ...privateFile(this),
      ...request(this),
    };
  }

  private log = wrap(this, (that, message: string) => {
    console.log(
      dayjs().format('HH:mm:ss.SSS???') + that.context.articlelistrule.title + '???' + message
    );
  });

  private getHomeSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  private getSearchSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  private getPreSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  private eval = wrap(this, (that, value: string) => {
    if (typeof value === 'string') that.vm?.run(value);
  });

  private parseDom = wrap(this, (that, html: string, code: string) => {
    const value = that.parseDomForHtml(html, code);
    return value && isPath(value) ? that.urlWrap(value) : value;
  });

  private parseDomForHtml(html: string, code: string) {
    if (!code || !html) return '';
    const codeSp = code.split('&&');
    const parsing = {
      selectorArr: codeSp.slice(0, codeSp.length - 1),
      attrName: codeSp[codeSp.length - 1],
    };
    const $ = cheerio.load(html);

    const cNode = $.root();

    return parseDomRes(cNode, parsing);
  }

  private parseDomForArray(html: string, code: string) {
    const selectorArr = code.split('&&');

    const $ = cheerio.load(html);

    let cNode = $.root();

    for (let selector of selectorArr.slice(0, selectorArr.length - 1)) {
      let eqIndex: string | number = 0;
      if (/,-?\d*/g.test(selector)) [selector, eqIndex] = selector.split(',');
      eqIndex = Number(eqIndex) || 0;
      cNode = cNode.find(selector).eq(eqIndex);
    }

    const arr = cNode
      .find(selectorArr[selectorArr.length - 1])
      .map(function () {
        return $(this).prop('outerHTML');
      })
      .get();
    return arr;
  }

  private writeFile = wrap(this, (that, fileUrl: string, content: string) => {
    if (!fileUrl.startsWith('hiker://files')) {
      throw new Error('fileUrl must start with hiker://files');
    }
    const url = new URL(fileUrl);
    const path = decodeURIComponent(url.pathname);
    const filePath = join(that.documentsDir, path);
    if (!filePath.startsWith(that.documentsDir)) {
      throw new Error('???????????????');
    }
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, content);
  });

  private getPrivateJS(code: string) {
    return PrivateJsEncrypt(code);
  }

  private evalPrivateJS = wrap<this, string, any>(this, (that, code) => {
    return that.vm?.run(PrivateJsDecode(code).replace(/let\s/g, 'var '));
  });

  /**
   * ????????????
   * @private
   */
  private refreshPage = wrap(this, (that) => {
    that.emit(REFRESH_PAGE);
  });

  public md5(str: string) {
    return CryptoJS.MD5(str).toString();
  }

  private jsWrap(js) {
    return js;
    // return (
    //   '(async function () {' +
    //   js.replace(/(fetchCookie|fetch)/g, 'await $1') +
    //   '})().catch((e) => {console.error(e.message)})'
    // );
  }

  /**
   * ?????????????????????????????????
   * "?????????require('http://xxx/t.js?v=1'); header({??????:'a&&Text'})",
   * "http://xxx/t.js??????????????????????????????????????????function header(rule){}",
   * "???????????????require?????????????????????md5?????????????????????????????????????????????????????????????????????????????????fetch????????????????????????eval",
   * "????????????????????????????????????????????????????????????????????????????????????????????????????????????()->{}????????????????????????require???????????????????????????????????????????????????????????????????????????",
   * "??????????????????????????????????????????????????????????????????????????????????????????????v=1?????????????????????????????????????????????????????????md5?????????????????????????????????",
   * "??????????????????header???require('http://xxx/t.js?v=1', {headers:{}})????????????fetch????????????",
   * "???????????????requireCache('http://xxx/t.js', 24)????????????????????????24??????????????????????????????????????????rc",
   * "??????????????????????????????eval???fetchCache('http://xxx/t.js', 24)????????????????????????24??????????????????????????????????????????fc",
   * "????????????????????????????????????deleteCache('http://xxx/t.js')????????????????????????????????????????????????require??????????????????"
   * @param url
   */
  private require = wrap<this, any, void>(
    this,
    (
      that,
      url: string,
      data = {
        headers: {},
      },
      version = 0
    ) => {
      that.requireCache(url, 0, data, version);
    }
  );

  private deleteCache = wrap(this, (that, url: string) => {
    const fileName = that.md5(url);
    const filePath = join(that.documentsDir, './libs/' + fileName + '.js');
    if (fs.existsSync(filePath)) {
      return fs.rmSync(filePath);
    }
  });

  private getCryptoJS() {
    return fs.readFileSync(join(__dirname, './static/crypto-js.min.js'));
  }

  private setError(message) {
    throw new Error(message);
  }

  private initConfig = wrap(this, (that, config: any) => {
    that.context.config = { ...that.context.config, ...config };
    that.context.allConfig[that.context.articlelistrule.id || that.context.articlelistrule.title] =
      that.context.config;
  });

  private getVar = wrap(this, (that, key: string, defaultValue = '') => {
    return that.context.vars[key] || defaultValue;
  });

  private putVar = wrap<this, any, void>(
    this,
    (that, key: string | { key: string; value: string }, value: string) => {
      if (isObject(key)) {
        that.context.vars[key.key] = key.value;
      } else {
        that.context.vars[key] = value;
      }
    }
  );

  private clearVar = wrap(this, (that, key: string) => {
    if (that.context.vars[key]) {
      delete this.context.vars[key];
    }
  });

  private putMyVar = wrap(this, (that, key: string, value: string) => {
    that.context.myVars[key] = value;
    that.context.allMyVars[that.context.articlelistrule.id || that.context.articlelistrule.title] =
      that.context.myVars;
  });

  private getMyVar = wrap(this, (that, key: string, defaultValue: string) => {
    return that.context.myVars[key] || defaultValue;
  });

  private clearMyVar = wrap(this, (that, key: string) => {
    if (that.context.myVars[key]) {
      delete this.context.myVars[key];
    }
  });

  private requireCache = wrap<this, any, void>(
    this,
    (
      that,
      url: string,
      hour: number,
      data = {
        headers: {},
      },
      version = 0
    ) => {
      const fileName = that.md5(url);
      const configPath = join(that.documentsDir, './libs/' + fileName + '.json');
      const filePath = join(that.documentsDir, './libs/' + fileName + '.js');
      const requirePath = that.requirePath;
      if (!fs.existsSync(configPath)) {
        fs.ensureFileSync(configPath);
        const content = JSON.stringify({
          version,
          url,
        });
        fs.writeFileSync(configPath, content);
      }

      // ???????????????
      const configTxt = fs.readFileSync(configPath, 'utf-8');
      if (isJSON(configTxt)) {
        const config = JSON.parse(configTxt);
        if (config.version != version) {
          fs.rmSync(configPath);
          config.version = version;
          fs.writeFileSync(configPath, JSON.stringify(config));
        }
      }

      // ??????????????????
      function writeDependFile() {
        const content = request(that).fetch(url, {
          headers: data.headers,
        });
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, content);
        addOrUpdateRequireData(requirePath, url, filePath);
      }

      if (!fs.existsSync(filePath)) {
        writeDependFile();
      } else if (hour) {
        // ??????????????????
        const data = getRequireData(requirePath);
        const index = data.findIndex((item) => item.url === url);
        if (index === -1 || dayjs(data[index].accessTime).add(hour, 'hour').isBefore(dayjs())) {
          fs.rmSync(filePath);
          writeDependFile();
        }
      }

      return that.vm?.runFile(filePath);
    }
  );

  private getUrl = wrap(this, (that) => {
    return that.context.myUrl;
  });

  private setLastChapterRule() {}

  private showLoading = wrap(this, (that, title: string) => {
    that.emit(SHOW_LOADING, title);
  });

  private hideLoading = wrap(this, (that) => {
    that.emit(HIDE_LOADING);
  });

  private _addListener = wrap(this, () => {});

  private getPath = wrap(this, (that, url: string) => {
    if (url.startsWith('hiker://files')) {
      const urlObj = new URL(url);
      const path = decodeURIComponent(urlObj.pathname);
      return join(that.documentsDir, path);
    } else {
      return url;
    }
  });
}
