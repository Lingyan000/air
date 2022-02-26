export const PASSWORD_SIGN: {
  [key in PasswordSignType]: {
    sign: string;
    name: string;
  };
} = {
  ad_subscribe_url: {
    sign: '￥ad_subscribe_url￥',
    name: '订阅链接',
  },
  ad_url_rule: {
    sign: '￥ad_subscribe_url￥',
    name: '广告网址拦截',
  },
  bookmark: {
    sign: '￥bookmark￥',
    name: '书签规则',
  },
  bookmark_url: {
    sign: '￥bookmark_url￥',
    name: '书签规则',
  },
  fast_play_urls: {
    sign: '￥fast_play_urls￥',
    name: '快速播放白名单',
  },
  file_url: {
    sign: '￥file_url￥',
    name: '本地文件',
  },
  home_sub: {
    sign: '￥home_sub￥',
    name: '合集规则订阅',
  },
  js_url: {
    sign: '￥js_url￥',
    name: '网页插件',
  },
  publish_account: {
    sign: '￥publish_account￥',
    name: '云仓库账号密码设置',
  },
  search_engine_url: {
    sign: '￥search_engine_url￥',
    name: '搜索引擎合集',
  },
  search_engine_v2: {
    sign: '￥search_engine_v2￥',
    name: '搜索引擎',
  },
  xt_dialog_rules: {
    sign: '￥xt_dialog_rules￥',
    name: '嗅探弹窗黑名单',
  },
  home_rule_url: {
    sign: '￥home_rule_url￥',
    name: '首页频道合集',
  },
  home_rule: {
    sign: '￥home_rule￥',
    name: '首页频道',
  },
  home_rule_v2: {
    sign: '￥home_rule_v2￥',
    name: '小程序',
  },
};

export const CLOUD_SHEAR_PLATE_MAP: {
  [key in CloudShearPlateType]: {
    name: string;
    validator: string;
  };
} = {
  'netcut.cn': {
    name: '云剪贴板分享2',
    validator: 'http(s?):\\/\\/netcut.cn\\/p\\/.*',
  },
  'cmd.im': {
    name: '云剪贴板分享5',
    validator: 'http(s?):\\/\\/cmd.im\\/.*',
  },
  'pasteme.tyrantg.com': {
    name: '云剪贴板分享6',
    validator: 'http(s?):\\/\\/pasteme.tyrantg.com\\/xxxxxx/.*',
  },
};
