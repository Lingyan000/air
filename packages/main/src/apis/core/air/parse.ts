import { Got, Headers, Method } from 'got';
import iconv from 'iconv-lite';
import cheerio, { CheerioAPI } from 'cheerio';
import { VM } from 'vm2';
import {
  codeToJs,
  isHikerProtocol,
  isJsCode,
  isLazyJsCode,
  lazyCodeToJs,
  parseDomRes,
  replaceMark,
} from './utils';
import { URL } from 'url';
import { VmType } from '/@/apis/core/air/utils/airVm';
import { isObject, cloneDeep } from 'lodash';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import air from '/@/apis/core/air/index';
import Piscina from 'piscina';
import { MessageChannel } from 'worker_threads';
import path from 'path';
import { IAirVmWorkerParams } from '/@/apis/core/air/utils/airVmWorker';
import * as socketConstList from '#/events/socket-constants';
import validator from 'validator';
import isURL = validator.isURL;

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'airVmWorker.cjs'),
  idleTimeout: 30000,
});

export enum Parses {
  list,
  title,
  pic_url,
  desc,
  url,
}

export enum SearchParses {
  list,
  title,
  url,
  desc,
  content,
  img,
}

export interface IPages {
  col_type: ColType;
  name: string;
  path: string;
  rule: string;
}

class AirParse {
  baseUrl: string | undefined;
  myUrl = '';
  vars: { [key: string]: any };
  allMyVars: { [key: string]: { [key: string]: any } };
  colType: ColType = 'movie_3';
  pages: IPages[];
  isRefreshPage = false;
  allConfig: { [key: string]: { [key: string]: any } };
  config: { [key: string]: any };
  myVars: { [key: string]: any };
  socketGroupId: string;

  constructor(
    public readonly articlelistrule: ArticleListRule,
    public readonly home: any[],
    data: {
      allConfig: { [key: string]: { [key: string]: any } };
      vars: { [key: string]: any };
      allMyVars: { [key: string]: { [key: string]: any } };
      socketGroupId: string;
    }
  ) {
    this.pages = JSON.parse(this.articlelistrule?.pages || '[]');
    this.vars = data.vars || {};
    this.allConfig = data.allConfig || {};
    this.config = this.allConfig[this.articlelistrule.id || this.articlelistrule.title] || {};
    this.allMyVars = data.allMyVars || {};
    this.myVars = this.allMyVars[this.articlelistrule.id || this.articlelistrule.title] || {};
    this.home = home;
    this.socketGroupId = data.socketGroupId;
  }

  private setVmValue(vmData) {
    this.vars = vmData.vars || {};
    this.allConfig = vmData.allConfig || {};
    this.config = this.allConfig[this.articlelistrule.id || this.articlelistrule.title] || {};
    this.allMyVars = vmData.allMyVars || {};
    this.myVars = this.allMyVars[this.articlelistrule.id || this.articlelistrule.title] || {};
    this.isRefreshPage = vmData.isRefreshPage;
  }

  private runVm(
    code: string,
    options: {
      rescode?: string;
      vmType: VmType;
      sandbox?: { [key: string]: any };
    }
  ) {
    const { vmType, sandbox, rescode } = options;

    const channel = new MessageChannel();

    channel.port2.on('message', (message) => {
      if (message.ev && Object.keys(socketConstList).includes(message.ev)) {
        global.airServer?.fastify.io
          .to(this.socketGroupId)
          .emit(message.ev, ...(message.data || []));
      }
    });

    const params: IAirVmWorkerParams = {
      documentsDir: air.documentsDir,
      vmType,
      code,
      port: channel.port1,
      ctx: this,
      sandbox,
      rescode,
    };

    return piscina
      .run(params, {
        transferList: [channel.port1],
      })
      .then((res) => {
        this.setVmValue(res.ctx);
        return { result: res.result, AIR_RESULT: res.AIR_RESULT };
      });
  }

  urlWrap(url: string): string {
    if (this.baseUrl) {
      try {
        return new URL(url || '', this.baseUrl).href.toString();
      } catch (e) {
        console.error(e);
      }
    }
    return url;
  }

  async parseCommon(config: IParseRuleConfig) {
    let url = config.url.startsWith('/') ? this.articlelistrule.url : config.url;
    if (url.startsWith('hiker://empty#')) {
      url = url.replace(/hiker:\/\/empty(#+)/i, '');
    }
    try {
      this.baseUrl = new URL(url).origin;
    } catch (e) {
      this.baseUrl = '';
    }
    this.baseUrl = isURL(this.baseUrl) ? this.baseUrl : new URL(this.articlelistrule.url).origin;
    this.myUrl = config.url + (config.params ? '?' + config.params : '');
    // if (config.preParseCode) {\
    //   const sandbox = await this.preParse(config.preParseCode);
    //   this.vars = Object.assign(this.vars, sandbox.AIR_VARS);
    // }
    config.headers = await this.jsHandleHeaders(cloneDeep(config.headers));
  }

  /**
   * 解析规则
   * @param config
   */
  async parseRule(config: IParseRuleConfig) {
    const got: Got = (await require('./esm-got.cjs')).default;
    await this.parseCommon(config);
    if (!isHikerProtocol(config.url)) {
      return got(config.url, {
        searchParams: config.params ? config.params : undefined,
        body: config.data ? config.data : undefined,
        method: config.method || 'get',
        http2: true,
        headers: config.headers || {},
      })
        .buffer()
        .then((response) => {
          const data = iconv.decode(response, config.encoding || 'utf-8');
          return isJsCode(config.parseCode)
            ? this.parseBecomeJsResult(data, codeToJs(config.parseCode))
            : this.parseBecomeHtmlResult(data, config.parseCode);
        });
    } else {
      return isJsCode(config.parseCode)
        ? this.parseBecomeJsResult('', codeToJs(config.parseCode))
        : this.parseBecomeHtmlResult('', config.parseCode);
    }
  }

  /**
   * 解析搜索规则
   * @param config
   */
  async parseSearchRule(config: IParseRuleConfig) {
    const got: Got = (await require('./esm-got.cjs')).default;
    await this.parseCommon(config);
    if (!isHikerProtocol(config.url)) {
      return got(this.urlWrap(config.url), {
        searchParams: config.params ? config.params : undefined,
        body: config.data ? config.data : undefined,
        method: config.method || 'get',
        http2: true,
        headers: config.headers || {},
        timeout: {
          request: 10000,
        },
      })
        .buffer()
        .then(async (response) => {
          const data = iconv.decode(response, config.encoding || 'utf-8');
          return isJsCode(config.parseCode)
            ? this.parseSearchJsResult(data, codeToJs(config.parseCode))
            : this.parseSearchHtmlResult(data, config.parseCode);
        });
    } else {
      return isJsCode(config.parseCode)
        ? this.parseSearchJsResult('', codeToJs(config.parseCode))
        : this.parseSearchHtmlResult('', config.parseCode);
    }
  }

  /**
   * 解析详情规则
   * @param config
   */
  async parseDetailRule(config: IParseRuleConfig) {
    return this.parseRule(config);
  }

  async parseLazyRule(config: IParseRuleConfig) {
    const isJs = isLazyJsCode(config.parseCode);
    if (isJs) {
      return this.parseLazyJsResult(
        lazyCodeToJs(
          config.parseCode.replace(
            /e=VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException\(e\);/g,
            ''
          )
        ),
        config.input || ''
      );
    } else {
      const got: Got = (await require('./esm-got.cjs')).default;
      await this.parseCommon(config);
      return got(config.url, {
        searchParams: config.params ? config.params : undefined,
        body: config.data ? config.data : undefined,
        method: config.method || 'get',
        http2: true,
        headers: config.headers || {},
        timeout: {
          request: 10000,
        },
      })
        .buffer()
        .then(async (response) => {
          const data = iconv.decode(response, config.encoding || 'utf-8');
          return this.parseLazyHtmlResult(data, config.parseCode);
        });
    }
  }

  async parseChildPageRule(config: IParseRuleConfig) {
    const pageUrl = new URL(config.url);
    let apiUrl = pageUrl.searchParams.get('url');
    apiUrl = apiUrl ? replaceMark(apiUrl) : '';
    config.url = apiUrl;
    config = Object.assign(config, this.splitProtoUrl(config.url, config.fyPageParams!));
    const page = this.pages.find((item) => item.path === pageUrl.pathname.slice(1));
    config.parseCode = page?.rule || '';
    return this.parseRule(config).then((data) =>
      data.map((data) => ({
        ...data,
        col_type: data.col_type || page?.col_type || 'movie_3',
      }))
    );
  }

  async parseCustomRule(config: IParseRuleConfig) {
    if (config.preParseCode) {
      await this.preParse(config.preParseCode);
    }
    return this.parseRule(config);
  }

  async preParse(js) {
    await this.runVm(js, {
      vmType: 'preIn',
    });
    return 'ok';
  }

  parseNode($: CheerioAPI, node: any, code: string): string {
    if (!code) return '';
    let value: string | null = '';
    let codeValue = code;
    let jsSrc = '';
    if (/\.js:/g.test(code)) [codeValue, jsSrc] = code.split('.js:');
    const codeSp = codeValue.split('&&');
    const parsing = {
      selectorArr: codeSp.slice(0, codeSp.length - 1),
      attrName: codeSp[codeSp.length - 1],
    };

    const cNode = $(node);

    value = parseDomRes(cNode, parsing) || '';
    if (jsSrc) {
      const vm = new VM();
      vm.setGlobal('input', value);
      value = vm.run(jsSrc);
    }
    return value as string;
  }

  parseNodeForArray($: CheerioAPI, code: string) {
    const selectorArr = code.split('&&');

    let cNode = $.root();

    for (let selector of selectorArr.slice(0, selectorArr.length - 1)) {
      let eqIndex: string | number = 0;
      if (/,-?\d*/g.test(selector)) [selector, eqIndex] = selector.split(',');
      eqIndex = Number(eqIndex) || 0;
      cNode = cNode.find(selector).eq(eqIndex);
    }

    return cNode.find(selectorArr[selectorArr.length - 1]);
  }

  async parseBecomeJsResult(res: string, code: string): Promise<HikerResultOption[]> {
    let arr: HikerResultOption[] = [];
    const vmRes = await this.runVm(code, {
      vmType: 'homeIn',
      rescode: res,
    });
    arr = vmRes.AIR_RESULT.data as HikerResultOption[];
    return arr;
  }

  parseBecomeHtmlResult(html: string, code: string): HikerResultOption[] {
    let arr: HikerResultOption[] = [];
    const parseArr = code.split(';'); // 格式：列表;标题;图片;描述;链接
    if (parseArr.length !== 5) return arr;
    const $ = cheerio.load(html);
    const nodeArr = $(parseArr[Parses.list].replaceAll('&&', ' '));
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    arr = nodeArr
      .map(function () {
        return {
          title: that.parseNode($, this, parseArr[Parses.title]),
          pic_url: that.parseNode($, this, parseArr[Parses.pic_url]),
          col_type: that.colType,
          desc: that.parseNode($, this, parseArr[Parses.desc]),
          url: that.parseNode($, this, parseArr[Parses.url]),
        };
      })
      .get();
    return arr;
  }

  async parseSearchJsResult(res: string, code: string): Promise<HikerSearchResultOption[]> {
    let arr: HikerResultOption[] = [];
    const vmRes = await this.runVm(code, {
      vmType: 'searchIn',
      rescode: res,
    });
    arr = vmRes.AIR_RESULT.data as HikerSearchResultOption[];
    // this.vars = airVm.sandbox.AIR_VARS;
    return arr;
  }

  parseSearchHtmlResult(res: string, code: string): HikerSearchResultOption[] {
    let arr: HikerSearchResultOption[] = [];
    const parseArr = code.split(';'); // 格式：列表;标题;链接;描述;详情;图片
    if (parseArr.length !== 6) return arr;
    const $ = cheerio.load(res);
    const nodeArr = this.parseNodeForArray($, parseArr[SearchParses.list]);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    arr = nodeArr
      .map(function () {
        const title = that.parseNode($, this, parseArr[SearchParses.title]);
        const url = that.parseNode($, this, parseArr[SearchParses.url]);
        const desc = that.parseNode($, this, parseArr[SearchParses.desc]);
        const content = that.parseNode($, this, parseArr[SearchParses.content]);
        const img = that.parseNode($, this, parseArr[SearchParses.img]);
        return {
          title,
          url: that.urlWrap(url),
          desc,
          content,
          img: img ? that.urlWrap(img) : undefined,
        };
      })
      .get();
    return arr;
  }

  async parseLazyJsResult(code: string, input: string): Promise<string> {
    let url = '';

    const { result } = await this.runVm(code.replace(/；；/g, ';'), {
      vmType: 'baseIn',
      sandbox: {
        input: input,
      },
    });
    url = result;
    return url;
  }

  parseLazyHtmlResult(res: string, code: string): string {
    const $ = cheerio.load(res);
    return this.parseNode($, this, code);
  }

  async jsHandleHeaders(headers) {
    if (isObject(headers)) {
      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          let value = headers[key];
          let jsSrc = '';
          if (/\.js:/g.test(value)) [value, jsSrc] = value.split('.js:');
          if (jsSrc) {
            // airVm.vm.setGlobal('input', value);
            // value = airVm.vm.run(jsSrc);
            const { result } = await this.runVm(jsSrc, {
              vmType: 'baseIn',
              sandbox: {
                input: value,
              },
            });
            value = result;
          }
          headers[key] = value;
        }
      }
      // Object.keys(headers).forEach((key) => {
      //   let value = headers[key];
      //   let jsSrc = '';
      //   if (/\.js:/g.test(value)) [value, jsSrc] = value.split('.js:');
      //   if (jsSrc) {
      //     const airVm = new AirVm(
      //       'baseIn',
      //       {
      //         rescode: '',
      //       },
      //       this
      //     );
      //     // airVm.vm.setGlobal('input', value);
      //     // value = airVm.vm.run(jsSrc);
      //     const { returnValue } = await airVm.run(jsSrc, {
      //       input: value,
      //     });
      //     value = returnValue;
      //   }
      //   headers[key] = value;
      // });
      return headers;
    } else {
      return headers;
    }
  }

  splitProtoUrl(protoUrl: string, fyPageParams: FyPageParams): UrlConfig {
    const {
      fyclass = '',
      fyarea = '',
      fyyear = '',
      fysort = '',
      fypage = '',
      fyAll = '',
      search = '',
    } = fyPageParams;
    let url: string;
    let method: string;
    let encoding: string;
    let headers: any;
    // eslint-disable-next-line prefer-const
    [url, method = 'GET', encoding = 'utf-8', headers = '{User-Agent@air/1.0.0}'] =
      protoUrl.split(';');
    url = url
      .replace(/fyclass/g, fyclass)
      .replace(/fyarea/g, fyarea)
      .replace(/fyyear/g, fyyear)
      .replace(/fysort/g, fysort)
      .replace(/fypage/g, fypage)
      .replace(/fyAll/g, fyAll)
      .replace(/\*\*/g, search);
    try {
      headers = headers
        .match(/\{(.+?)\}$/)[1]
        .replace(/；；/g, ';')
        .split('&&')
        .map((item) => item.split('@'))
        .reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, {});
    } catch (error) {
      console.error(error);
      headers = {
        'user-agent': 'air/1.0.0',
      } as Headers;
    }
    let params = '';
    let data: any = undefined;
    if (url.includes('?')) {
      [url, params = ''] = url.split('?');
    }
    if (['post', 'put'].includes(method.toLowerCase())) {
      [url, data = ''] = url.split('?');
      data = data
        .split('&')
        .map((item) => item.split('='))
        .reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, {});
    }
    return {
      url: url,
      params,
      data,
      method: method as Method,
      encoding,
      headers: headers,
    };
  }
}

export default AirParse;
