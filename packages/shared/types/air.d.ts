interface IParseRuleConfig {
  headers?: import('got').Headers;
  myUrl: string;
  url: string;
  params: string;
  method: import('got').Method;
  data: any;
  parseCode: string;
  encoding?: string;
  fyPageParams?: FyPageParams;
  preParseCode?: string;
  input?: string;
}

type ColType =
  | 'movie_3'
  | 'movie_3_marquee'
  | 'movie_2'
  | 'movie_1'
  | 'movie_1_left_pic'
  | 'movie_1_vertical_pic'
  | 'movie_1_vertical_pic_blur'
  | 'text_1'
  | 'text_center_1'
  | 'text_2'
  | 'text_3'
  | 'text_4'
  | 'text_5'
  | 'long_text'
  | 'rich_text'
  | 'pic_3'
  | 'pic_3_square'
  | 'pic_2'
  | 'pic_1'
  | 'pic_1_full'
  | 'icon_4'
  | 'icon_4_card'
  | 'icon_small_4'
  | 'icon_small_3'
  | 'icon_round_small_4'
  | 'icon_2'
  | 'icon_2_round'
  | 'line'
  | 'line_blank'
  | 'avatar'
  | 'blank_block'
  | 'x5_webview_single'
  | 'flex_button'
  | 'scroll_button'
  | 'card_pic_2'
  | 'card_pic_1'
  | 'card_pic_2_2'
  | 'card_pic_2_2_left'
  | 'input'
  | 'icon_1_search'
  | 'big_blank_block';

type FyBaseUrlType = 'search' | 'home';

interface FyDetailParams {
  url: string;
  type: FyBaseUrlType;
}

interface FyLazyParams {
  url: string;
  lazyRule: string;
  type: FyBaseUrlType;
}

interface HikerResultOption {
  title: string;
  desc?: string;
  col_type?: ColType;
  url?: string;
  img?: string;
  pic_url?: string;
  extra?: any;
}

interface HikerSearchResultOption {
  title: string; // 标题
  desc?: string; // 描述
  content?: string; // 详情
  url?: string; // 链接
  img?: string; // 图片
  pic_url?: string; // 图片
}

interface FyPageParams {
  fyclass?: string;
  fyarea?: string;
  fyyear?: string;
  fysort?: string;
  fypage?: string;
  fyAll?: string;
  search?: string;
}

// interface FyChildPageParams extends FyPageParams {
//   fy;
// }

interface UrlConfig {
  url: string;
  params: string;
  method: import('got').Method;
  data?: any;
  encoding: string;
  headers: import('got').Headers;
}

type PasswordSignType =
  | 'home_rule_url' // 首页合集
  | 'home_rule' //首页频道
  | 'search_engine_url' // 搜索引擎合集
  | 'search_engine_v2' // 搜索引擎
  | 'js_url' // 网页插件
  | 'ad_url_rule' // 广告网址拦截
  | 'bookmark' // 书签规则
  | 'bookmark_url' // 书签合集
  | 'file_url' // 本地文件
  | 'fast_play_urls' // 快速播放白名单
  | 'xt_dialog_rules' // 嗅探弹窗黑名单
  | 'ad_subscribe_url' // 广告拦截订阅
  | 'home_sub' // 小程序规则订阅
  | 'publish_account' // 云仓库账号密码设置
  | 'home_rule_v2'; // 小程序

type CloudShearPlateType = 'cmd.im' | 'pasteme.tyrantg.com' | 'netcut.cn';
