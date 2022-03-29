import http from '/@/utils/http/axios';
import { Playerposhis as PlayerposhisQuery } from '#/params';

export function record(params: PlayerposhisQuery.Record) {
  return http.request<string>({
    url: '/playerposhis/record',
    method: 'put',
    data: params,
  });
}

export function getPos(params: PlayerposhisQuery.GetPos) {
  return http.request<number>({
    url: '/playerposhis/getPos',
    method: 'get',
    params,
  });
}
