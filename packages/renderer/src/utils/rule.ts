import { isImageUrl, isJson, isVideoUrl } from '/@/utils/index';
import { isObject } from '/@/utils/is';

export type ItemUrlSplitResultType =
  | 'rule'
  | 'lazyRule'
  | 'link'
  | 'image'
  | 'video'
  | 'page'
  | 'toast'
  | 'object';

export interface ItemUrlSplitResult {
  url: string;
  type: ItemUrlSplitResultType;
  rule?: string;
}

export function replaceMark(value: string): string {
  return value.replace(/？？/g, '?').replace(/＆＆/g, '&');
}

export function splitItemUrl(url = ''): ItemUrlSplitResult {
  if (url.includes('@lazyRule')) {
    const [resUrl, rule] = url.split('@lazyRule=');
    return {
      url: resUrl,
      type: 'lazyRule',
      rule,
    };
  } else if (url.includes('@rule')) {
    const [resUrl, rule] = url.split('@rule=');
    return {
      url: resUrl,
      type: 'rule',
      rule,
    };
  } else if (url.startsWith('hiker://page')) {
    return {
      url: url,
      type: 'page',
    };
  } else if (isJson(url) && isObject(JSON.parse(url))) {
    return {
      url,
      type: 'object',
    };
  } else if (isImageUrl(url)) {
    return {
      url,
      type: 'image',
    };
  } else if (isVideoUrl(url)) {
    return {
      url,
      type: 'video',
    };
  } else if (url.startsWith('toast://')) {
    return {
      url,
      type: 'toast',
    };
  } else {
    return {
      url,
      type: 'link',
    };
  }
}
