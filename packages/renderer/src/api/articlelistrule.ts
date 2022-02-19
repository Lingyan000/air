import http from '/@/utils/http/axios';
import * as Models from '#/models';

// 获取规则列表
export function getArticlelistruleList() {
  return http.request<Models.Articlelistrules>({
    url: '/articlelistrule',
    method: 'get',
  });
}
