import http from '/@/utils/http/axios';
import { ViewHistory as ViewHistoryQuery } from '#/params';
import * as Model from '#/models';

export function all(params: ViewHistoryQuery.All) {
  return http.request<{ rows: Model.ViewHistory[]; count: number }>({
    url: '/viewhistory/all',
    method: 'get',
    params,
  });
}

export function getViewHistory(params: ViewHistoryQuery.GetLastclick) {
  return http.request<Model.ViewHistory>({
    url: '/viewhistory/getViewHistory',
    method: 'get',
    params,
  });
}

export function record(params: ViewHistoryQuery.Record) {
  return http.request<string>({
    url: '/viewhistory/record',
    method: 'put',
    data: params,
  });
}

export function recordClick(params: ViewHistoryQuery.RecordClick) {
  return http.request<string>({
    url: '/viewhistory/recordClick',
    method: 'put',
    data: params,
  });
}
