import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { ViewHistory as ViewHistoryQuery } from '#/params';
import Viewhistory from '/@/apis/core/database/sqlite/models/viewhistory';
import { URL } from 'url';

export default function recordClick() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ViewHistoryQuery.RecordClick;
    }
  > = {
    url: '/viewhistory/recordClick',
    method: 'PUT',
    schema: {
      body: ViewHistoryQuery.RecordClick,
    },
    handler: async (request) => {
      const lastclick = request.body.lastclickTitle + '@@' + request.body.lastclickIndex;

      let url = request.body.url;
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

      const viewHistory = await Viewhistory.findOne({
        where: {
          title: request.body.title,
          url: url,
        },
      });

      await viewHistory?.update({
        lastclick: lastclick,
      });
      return '成功';
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
