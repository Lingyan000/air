import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { ViewHistory as ViewHistoryQuery } from '#/params';
import ViewHistory from '/@/apis/core/database/sqlite/models/viewhistory';
import * as Models from '#/models';
import { Type } from '@sinclair/typebox';

export default function all() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Querystring: ViewHistoryQuery.All;
    }
  > = {
    url: '/viewhistory/all',
    method: 'GET',
    schema: {
      querystring: ViewHistoryQuery.All,
      response: {
        count: Type.Number(),
        rows: Models.ViewHistorys,
      },
    },
    handler: async (request) => {
      return ViewHistory.findAndCountAll({
        order: [['time', 'DESC']],
        offset: ((request.query.currentPage || 1) - 1) * request.query.pageSize,
        limit: request.query.pageSize || 15,
      });
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
