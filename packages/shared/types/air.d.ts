interface IParseRuleConfig {
  headers?: import('got').Headers;
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
  | 'icon_1_search';

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
