import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { Playerposhis as PlayerposhisQuery } from '#/params';
import Playerposhis from '/@/apis/core/database/sqlite/models/playerposhis';

export default function record() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Reply: string;
      Body: PlayerposhisQuery.Record;
    }
  > = {
    url: '/playerposhis/record',
    method: 'PUT',
    schema: {
      body: PlayerposhisQuery.Record,
    },
    handler: async (request) => {
      const playurl = request.body.playurl.replace(/\u0000/g, '');
      const [res, created] = await Playerposhis.findOrCreate({
        defaults: {
          playurl,
          pos: request.body.pos,
        },
        where: {
          playurl,
        },
      });
      if (!created) {
        res.update({
          playurl,
          pos: request.body.pos,
        });
      }
      return '成功';
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
