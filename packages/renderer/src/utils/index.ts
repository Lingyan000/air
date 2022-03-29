import { h, unref } from 'vue';
import type { App, Plugin } from 'vue';
import { NIcon, NTag } from 'naive-ui';
import { PageEnum } from '/@/enums/pageEnum';
import { isObject } from './is/index';
import { cloneDeep } from 'lodash-es';
import { nanoid } from 'nanoid';
import jsoup from 'fetch-jsonp';

/**
 * render 图标
 * */
export function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

/**
 * render new Tag
 * */
const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' };

export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color,
      },
      { default: () => text }
    );
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap: Array<any>, routerName: string, location: string) {
  const cloneRouterMap = cloneDeep(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === 'header') {
    const firstRouter: any[] = [];
    newRouter.forEach((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      info.children = undefined;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
      };
      firstRouter.push(currentMenu);
    });
    return firstRouter;
  } else {
    return getChildrenRouter(newRouter.filter((item) => item.name === routerName));
  }
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children);
    }
    return currentMenu;
  });
}

/**
 * 判断根路由 Router
 * */
export function isRootRouter(item) {
  return item.meta?.alwaysShow != true && item.children?.length === 1;
}

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !['/:path(.*)*', '/', PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(item.path)
    );
  });
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 *  找到对应的节点
 * */
let result = null;

export function getTreeItem(data: any[], key?: string | number): any {
  data.map((item) => {
    if (item.key === key) {
      result = item;
    } else {
      if (item.children && item.children.length) {
        getTreeItem(item.children, key);
      }
    }
  });
  return result;
}

/**
 *  找到所有节点
 * */
const treeAll: any[] = [];

export function getTreeAll(data: any[]): any[] {
  data.map((item) => {
    treeAll.push(item.key);
    if (item.children && item.children.length) {
      getTreeAll(item.children);
    }
  });
  return treeAll;
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
export function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
}

export function isHex(value: string) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
}

export function isImageUrl(url: string) {
  return /\.(gif|jpg|jpeg|png|svg)$/i.test(url);
}

export function isVideoUrl(url: string) {
  try {
    const url2 = new URL(url);
    url = url2.pathname;
  } catch (e) {}
  return (
    /(mp4|mov|m4v|webm|flv|wmv|avi|3gp|mkv|m3u8).*/i.test(url) || /.*#isVideo=true#.*/i.test(url)
  );
}

export function isAudioUrl(url: string) {
  return /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(url);
}

export function isToast(url: string) {
  return url.startsWith('toast://');
}

export function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export type IUrlType = 'image' | 'video' | 'audio' | 'toast' | 'object' | 'other';

export function urlType(url: string): IUrlType {
  if (isJson(url) && isObject(JSON.parse(url))) {
    return 'object';
  }
  if (isToast(url)) {
    return 'toast';
  }
  if (isImageUrl(url)) {
    return 'image';
  }
  if (isVideoUrl(url)) {
    return 'video';
  }
  if (isAudioUrl(url)) {
    return 'audio';
  }
  return 'other';
}

export function isHlsUrl(url: string) {
  return /\.m3u8$/i.test(url);
}

export function spliteArray<T>(arr: T[], size: number) {
  const arrays: {
    id: string;
    chunk: T[];
  }[] = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, size);

    arrays.push({
      id: nanoid(),
      chunk,
    });
  }
  return arrays;
}

// 获取数组中当前索引相邻的所有包含符合条件的元素及本身
export function getAdjacentElements<T>(arr: T[], index: number, fn: (item: T) => boolean) {
  const result: T[] = [];
  if (index >= 0 && index < arr.length) {
    if (index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        if (fn(arr[i])) {
          result.push({ ...arr[i], use: false });
        } else {
          break;
        }
      }
    }
    result.reverse();
    result.push({ ...arr[index], use: true });
    if (index < arr.length - 1) {
      for (let i = index + 1; i < arr.length; i++) {
        if (fn(arr[i])) {
          result.push({ ...arr[i], use: false });
        } else {
          break;
        }
      }
    }
  }
  return result;
}

export function getBaiduSuggestion(keyword: string) {
  return jsoup(
    `http://suggestion.baidu.com/su?wd=${keyword}&p=3&t=${new Date().valueOf()}&qq-pf-to=pcqq.c2c&cb=callback`,
    {
      jsonpCallbackFunction: 'callback',
    }
  ).then((res) => {
    return res.json();
  });
}
