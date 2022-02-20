import cheerio from 'cheerio';
import { VM, VMOptions, VMScript } from 'vm2';
import { Headers, Method } from 'got';
import fs, { readFileSync } from 'fs-extra';
import { join } from 'path';
import { isObject, wrap } from 'lodash';
import AirParse from '/@/apis/core/air/parse';
import { isPath, parseDomRes, PrivateJsDecode } from '/@/apis/core/air/utils/index';
import { createSyncFn } from 'synckit';
import { URL } from 'url';
import CryptoJS from 'crypto-js';
import { PC_UA } from '#/parse/constants';

const vmScript = join(__dirname, './vm/script.js');
const vmHikerurl = join(__dirname, './vm/Hikerurl.js');

export type VmType = 'baseIn' | 'homeIn' | 'searchIn' | 'preIn';

export interface AirVmParams {
  rescode?: string | null;
  documentsDir: string;
}

export interface FetchConfig {
  headers: Headers;
  body?: any;
  method: Method;
}

export default class AirVm {
  public rescode: any;
  public vm: VM | undefined;
  public vmType: VmType;
  public sandbox: any;
  public result: any = { data: [] };
  public ctx: typeof AirParse.prototype;
  public documentsDir: string;

  constructor(
    vmType: VmType,
    params: AirVmParams,
    ctx: typeof AirParse.prototype,
    sandbox: any = {}
  ) {
    this.ctx = ctx;
    const { rescode, documentsDir } = params;
    this.documentsDir = documentsDir;
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
    if (this.ctx.baseUrl) {
      try {
        return new URL(url || '', this.ctx.baseUrl).href.toString();
      } catch (e) {
        console.error(e);
      }
    }
    return url;
  }

  getSandbox() {
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

  getBaseSandbox() {
    return {
      config: this.ctx.config,
      pd: this.parseDom,
      pdfh: this.parseDomForHtml,
      pdfa: this.parseDomForArray,
      md5: this.md5,
      parseDom: this.parseDom,
      parseDomForHtml: this.parseDomForHtml,
      parseDomForArray: this.parseDomForArray,
      fetch: this.fetch,
      fetchCookie: this.fetchCookie,
      AIR_VARS: this.ctx.vars,
      AIR_RESULT: this.result,
      AIR_RESCODE: this.rescode,
      writeFile: this.writeFile,
      MY_URL: this.ctx.myUrl,
      eval: this.eval,
      evalPrivateJS: this.evalPrivateJS,
      log: console.log,
      base64Encode: this.base64Encode,
      base64Decode: this.base64Decode,
      CryptoJS: CryptoJS,
      request: this.fetch,
      refreshPage: this.refreshPage,
      PC_UA: PC_UA,
      require: this.require,
      deleteCache: this.deleteCache,
      MY_RULE: this.ctx.articlelistrule,
      putVar: this.putVar,
      putVar2: this.putVar,
      getVar: this.getVar,
      clearVar: this.clearVar,
      getCryptoJS: this.getCryptoJS,
      setError: this.setError,
      fileExist: this.fileExist,
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
      showLoading: this.showLoading, // TODO
      addListener: this.addListener, // TODO
      getUrl: this.getUrl,
    };
  }

  eval = wrap(this, (that, value: string) => {
    that.vm?.run(value);
  });

  getHomeSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  getSearchSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  getPreSandbox() {
    return {
      ...this.getBaseSandbox(),
    };
  }

  parseDom = wrap(this, (that, html: string, code: string) => {
    const value = that.parseDomForHtml(html, code);
    return value && isPath(value) ? that.urlWrap(value) : value;
  });

  parseDomForHtml(html: string, code: string) {
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

  parseDomForArray(html: string, code: string) {
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

  fetch = wrap<this, any, string>(this, (that, reqUrl: string, config: FetchConfig) => {
    if (reqUrl.startsWith('hiker://')) {
      const url = new URL(reqUrl);
      switch (url.host) {
        case 'page':
          const page = that.ctx.pages.find((page) => page.path === url.pathname.slice(1));
          if (!page) throw new Error('page not found');
          return JSON.stringify(page);
        case 'files':
          const filePath = join(that.documentsDir, decodeURIComponent(url.pathname));
          if (!fs.existsSync(filePath)) return '';
          return readFileSync(filePath).toString();
        case 'home':
          return JSON.stringify(that.ctx.home);
      }
      return;
    }
    return createSyncFn(require.resolve('./worker/fetch'))(reqUrl, JSON.stringify(config));
  });

  fetchCookie(url, config: FetchConfig) {
    return createSyncFn(require.resolve('./worker/fetchCookie'))(url, JSON.stringify(config));
  }

  writeFile = wrap(this, (that, fileUrl: string, content: string) => {
    if (!fileUrl.startsWith('hiker://files')) {
      throw new Error('fileUrl must start with hiker://files');
    }
    const url = new URL(fileUrl);
    const path = decodeURIComponent(url.pathname);
    const filePath = join(that.documentsDir, path);
    if (!filePath.startsWith(that.documentsDir)) {
      throw new Error('地址不合法');
    }
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, content);
  });

  evalPrivateJS = wrap<this, string, any>(this, (that, code) => {
    return that.vm?.run(PrivateJsDecode(code));
  });

  /**
   * base64编码
   * @param src
   */
  base64Encode(src: string) {
    return CryptoJS.enc.Utf8.parse(src).toString(CryptoJS.enc.Base64);
  }

  /**
   * base64解码
   * @param src
   */
  base64Decode(src: string) {
    return CryptoJS.enc.Base64.parse(src).toString(CryptoJS.enc.Utf8);
  }

  refreshPage = wrap(this, (that) => {
    that.ctx.isRefreshPage = true;
  });

  md5(str: string) {
    return CryptoJS.MD5(str).toString();
  }

  jsWrap(js) {
    return js;
    // return (
    //   '(async function () {' +
    //   js.replace(/(fetchCookie|fetch)/g, 'await $1') +
    //   '})().catch((e) => {console.error(e.message)})'
    // );
  }

  /**
   * 远程模块（代码块）引用
   * "示例：require('http://xxx/t.js?v=1'); header({标题:'a&&Text'})",
   * "http://xxx/t.js是一个远程代码块地址，内容：function header(rule){}",
   * "原理：使用require软件会对链接取md5，然后判断文件是否存在，存在则直接取文件内容，不存在则fetch到本地，然后执行eval",
   * "注意：远程模块里面不要直接引用非顶层作用域的变量或者函数，比如在箭头函数()->{}里面定义变量然后require里面直接引用此变量名，应该使用传递参数来引用此变量",
   * "注意：如果远程文件有更新，软件是不会更新文件的，可以给链接加上?v=1这样的标志来区分版本，因为链接变了那么md5就不同，则文件名不一样",
   * "如果需要用到header：require('http://xxx/t.js?v=1', {headers:{}})，用法和fetch基本一致",
   * "临时缓存：requireCache('http://xxx/t.js', 24)，那么文件会缓存24小时，超过会重新下载，缩写：rc",
   * "临时缓存只获取不执行eval：fetchCache('http://xxx/t.js', 24)，那么文件会缓存24小时，超过会重新下载，缩写：fc",
   * "删除本地缓存、强制更新：deleteCache('http://xxx/t.js')，删除缓存到本地的文件，再次执行require则会重新下载"
   * @param url
   */
  require = wrap(this, (that, url: string) => {
    const fileName = that.md5(url);
    const filePath = join(that.documentsDir, './requires/' + fileName);
    if (!fs.existsSync(filePath)) {
      fs.ensureFileSync(filePath);
      const content = that.fetch(url);
      fs.writeFileSync(filePath, content);
    }
    that.vm?.runFile(filePath);
  });

  deleteCache = wrap(this, (that, url: string) => {
    const fileName = that.md5(url);
    const filePath = join(that.documentsDir, './requires/' + fileName);
    if (fs.existsSync(filePath)) {
      return fs.rmSync(filePath);
    }
  });

  getCryptoJS() {
    return fs.readFileSync(join(__dirname, './static/crypto-js.min.js'));
  }

  fileExist = wrap(this, (that, fileUrl: string) => {
    if (!fileUrl.startsWith('hiker://files')) {
      throw new Error('fileUrl must start with hiker://files');
    }
    const url = new URL(fileUrl);
    const path = decodeURIComponent(url.pathname);
    const filePath = join(that.documentsDir, path);
    return fs.existsSync(filePath);
  });

  setError(message) {
    console.error(message);
    throw new Error(message);
  }

  initConfig = wrap(this, (that, config: any) => {
    that.ctx.config = { ...that.ctx.config, ...config };
    that.ctx.allConfig[that.ctx.articlelistrule.id] = that.ctx.config;
  });

  getVar = wrap(this, (that, key: string, defaultValue: string) => {
    return that.ctx.vars[key] || defaultValue;
  });

  putVar = wrap<this, any, void>(
    this,
    (that, key: string | { key: string; value: string }, value: string) => {
      if (isObject(key)) {
        that.ctx.vars[key.key] = key.value;
      } else {
        that.ctx.vars[key] = value;
      }
    }
  );

  clearVar = wrap(this, (that, key: string) => {
    if (that.ctx.vars[key]) {
      delete this.ctx.vars[key];
    }
  });

  putMyVar = wrap(this, (that, key: string, value: string) => {
    that.ctx.myVars[key] = value;
    that.ctx.allMyVars[that.ctx.articlelistrule.id] = that.ctx.myVars[key];
  });

  getMyVar = wrap(this, (that, key: string, defaultValue: string) => {
    return that.ctx.myVars[key] || defaultValue;
  });

  clearMyVar = wrap(this, (that, key: string) => {
    if (that.ctx.myVars[key]) {
      delete this.ctx.myVars[key];
    }
  });

  requireCache = wrap<this, any, void>(this, (that, url: string, hour: number) => {
    console.log(hour);
    that.require(url);
  });

  getUrl = wrap(this, (that) => {
    return that.ctx.myUrl;
  });

  setLastChapterRule() {}

  showLoading() {}

  addListener() {}
}
