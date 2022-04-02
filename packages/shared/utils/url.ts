import { Headers, Method } from 'got';

export function getMyUrl(protoUrl: string, fyPageParams: FyPageParams) {
  const {
    fyclass = '',
    fyarea = '',
    fyyear = '',
    fysort = '',
    fypage = '',
    fyAll = '',
    search = '',
  } = fyPageParams;
  return protoUrl
    .replace(/fyclass/g, fyclass)
    .replace(/fyarea/g, fyarea)
    .replace(/fyyear/g, fyyear)
    .replace(/fysort/g, fysort)
    .replace(/fypage/g, fypage)
    .replace(/fyAll/g, fyAll)
    .replace(/\*\*/g, search);
}

export function splitProtoUrl(protoUrl: string, fyPageParams: FyPageParams): UrlConfig {
  let url: string;
  let method: string;
  let encoding: string;
  let headers: any;
  // eslint-disable-next-line prefer-const
  [url, method = 'GET', encoding = 'utf-8', headers = '{User-Agent@air/1.0.0}'] =
    protoUrl.split(';');
  url = getMyUrl(url, fyPageParams);
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
