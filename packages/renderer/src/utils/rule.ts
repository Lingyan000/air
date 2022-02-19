import { isImageUrl, isVideoUrl } from '/@/utils/index';

export type ItemUrlSplitResultType = 'rule' | 'lazyRule' | 'link' | 'image' | 'video' | 'page';

export interface ItemUrlSplitResult {
  url: string;
  type: ItemUrlSplitResultType;
  rule?: string;
}

export function replaceMark(value: string): string {
  return value.replace(/？？/g, '?').replace(/＆＆/g, '&');
}

export function splitItemUrl(url: string): ItemUrlSplitResult {
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
  } else {
    return {
      url,
      type: 'link',
    };
  }
}
