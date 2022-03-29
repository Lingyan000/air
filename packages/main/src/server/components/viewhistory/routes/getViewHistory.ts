import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { ViewHistory as ViewHistoryQuery } from '#/params';
import ViewHistory from '/@/apis/core/database/sqlite/models/viewhistory';
import { URL } from 'url';

export default function getViewHistory() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Querystring: ViewHistoryQuery.GetLastclick;
    }
  > = {
    url: '/viewhistory/getViewHistory',
    method: 'GET',
    schema: {
      querystring: ViewHistoryQuery.GetLastclick,
    },
    handler: async (request) => {
      let url = request.query.url;
      if (url.startsWith('hiker://page')) {
        try {
          const url2 = new URL(url);

          url =
            url2.searchParams
              .get('url')
              ?.replace(/；；/g, ';')
              .replace(/＆＆/g, '&')
              .replace(/？？/g, '?') || url;
        } catch (e) {}
      }
      return ViewHistory.findOne({
        where: {
          url: url,
          title: request.query.title,
        },
        raw: true,
      });
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
