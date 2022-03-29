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
      Reply: number;
      Querystring: PlayerposhisQuery.GetPos;
    }
  > = {
    url: '/playerposhis/getPos',
    method: 'GET',
    schema: {
      querystring: PlayerposhisQuery.GetPos,
    },
    handler: async (request) => {
      const playurl = request.query.playurl.replace(/\u0000/g, '');
      const res = await Playerposhis.findOne({
        where: {
          playurl,
        },
      });
      return res?.getDataValue('pos') || 0;
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
