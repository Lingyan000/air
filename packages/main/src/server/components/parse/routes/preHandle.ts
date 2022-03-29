import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import articlelistrule from '/@/apis/core/database/sqlite/models/articlelistrule';
import AirParse from '/@/apis/core/air/parse';
import { Parse as ParseQuery } from '#/params';

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ParseQuery.PreHandle;
    }
  > = {
    url: '/parse/preHandle',
    method: 'PUT',
    schema: {
      body: ParseQuery.PreHandle,
    },
    handler: async (request) => {
      const rule = await articlelistrule.findByPk(Number(request.body.id), {
        rejectOnEmpty: true,
        raw: true,
      });

      const home = await articlelistrule.findAll();

      if (!rule) throw new Error('规则不存在');
      const airParse = new AirParse(rule, home, (request as any).session || {});

      return airParse
        .preParse(rule.prerule)
        .then(() => {
          return {
            message: '成功',
          };
        })
        .finally(() => {
          (request as any).session.vars = airParse.vars;
          (request as any).session.allConfig = airParse.allConfig;
          (request as any).session.allMyVars = airParse.allMyVars;
        });
    },
    errorHandler: (error) => {
      console.error(error);
      return error;
    },
  };

  return route;
}
