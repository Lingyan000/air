import http from '/@/utils/http/axios';
import { Parse as ParseQuery } from '#/params';

export interface IGetRuleDetailResultParams {
  type: 'search' | 'home';
  id: number;
  url: string;
  vars: { [key: string]: any };
}

export interface IGetLazyRuleResultParams {
  type: 'search' | 'home';
  id: number;
  url: string;
  lazyRule: string;
  vars: { [key: string]: any };
}

// 解析搜索规则
export function getSearchRuleResult(params: ParseQuery.GetSearchRuleResult) {
  return http.request<HikerSearchResultOption[]>({
    url: '/parse/getSearchRuleResult',
    params,
    method: 'get',
  });
}

// 解析二级页面
export function getRuleDetailResult(params: ParseQuery.GetRuleDetailResult) {
  return http.request<HikerResultOption[]>({
    url: '/parse/getRuleDetailResult',
    params,
    method: 'get',
  });
}

// 动态解析
export function getLazyRuleResult(params: ParseQuery.GetLazyRuleResult) {
  return http.request<any>({
    url: '/parse/getLazyRuleResult',
    params,
    method: 'get',
  });
}

// 解析子页面
export function getChildPageRuleResult(params: ParseQuery.GetChildPageRuleResult) {
  return http.request<HikerResultOption[]>({
    url: '/parse/getChildPageRuleResult',
    params,
    method: 'get',
  });
}

// 预处理
export function preHandle(params: ParseQuery.PreHandle) {
  return http.request<string>({
    url: '/parse/preHandle',
    params,
    method: 'put',
  });
}

// 解析规则
export function getRuleResult(params: ParseQuery.GetRuleResult) {
  return http.request<HikerResultOption[]>({
    url: '/parse/getRuleResult',
    params,
    method: 'get',
  });
}
