import http from '/@/utils/http/axios';
import * as Models from '#/models';
import { Articlelistrule as ArticlelistruleParams } from '#/params';

// 获取规则列表
export function getArticlelistruleList() {
  return http.request<Models.Articlelistrules>({
    url: '/articlelistrule',
    method: 'get',
  });
}

// 导入
export function importRule(params: ArticlelistruleParams.ImportRule) {
  return http.request<Models.Articlelistrule>({
    url: '/articlelistrule/import',
    method: 'post',
    params,
  });
}
