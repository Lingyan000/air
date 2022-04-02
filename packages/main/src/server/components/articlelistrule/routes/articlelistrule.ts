import type { RouteOptions } from 'fastify';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import { RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';
import { Http } from '@jonahsnider/util';
import * as Models from '#/models';

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Reply: Models.Articlelistrules;
    }
  > = {
    url: '/articlelistrule',
    method: 'GET',
    schema: {
      response: {
        [Http.Status.Ok]: Models.Articlelistrules,
      },
    },
    handler: async () => {
      return await ArticleListRule.findAll();
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
