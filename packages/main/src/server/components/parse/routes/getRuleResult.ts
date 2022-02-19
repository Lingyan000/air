import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import articlelistrule from '/@/apis/core/database/sqlite/models/articlelistrule';
import AirParse from '/@/apis/core/air/parse';
import { Method } from 'got';
import { Parse as ParseQuery } from '#/params';
import { From } from '#/enums';

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Querystring: ParseQuery.GetRuleResult;
    }
  > = {
    url: '/parse/getRuleResult',
    method: 'GET',
    schema: {
      querystring: ParseQuery.GetRuleResult,
    },
    handler: async (request) => {
      let url,
        params,
        data,
        encoding,
        method: Method = 'GET',
        headers;

      const rule = await articlelistrule.findByPk(Number(request.query.id), {
        rejectOnEmpty: true,
      });

      const home = await articlelistrule.findAll();

      if (!rule) throw new Error('规则不存在');
      const airParse = new AirParse(rule, home, (request as any).session || {});
      if (request.query.from === From['search']) {
        ({ url, params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.get('search_url'),
          {}
        ));
      } else {
        ({ url, params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.get('url'),
          {}
        ));
      }
      ({ url, params, data } = airParse.splitProtoUrl(request.query.url, {}));
      return airParse
        .parseRule({
          url: url,
          params,
          method,
          data,
          parseCode: request.query.rule,
          encoding,
          headers,
          fyPageParams: {},
          input: request.query.url,
        })
        .finally(() => {
          (request as any).session.vars = airParse.vars;
          (request as any).session.allConfig = airParse.allConfig;
          (request as any).session.allMyVars = airParse.allMyVars;
        });
    },
  };

  return route;
}
