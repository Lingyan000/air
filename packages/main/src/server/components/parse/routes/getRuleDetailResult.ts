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
      Querystring: ParseQuery.GetRuleDetailResult;
    }
  > = {
    url: '/parse/getRuleDetailResult',
    method: 'GET',
    schema: {
      querystring: ParseQuery.GetRuleDetailResult,
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
      let parseCode = '';
      if (request.query.from === From['search']) {
        const sdetail_find_rule = rule.get('sdetail_find_rule');
        parseCode = sdetail_find_rule === '*' ? rule.get('detail_find_rule') : sdetail_find_rule;
        ({ url, params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.getDataValue('search_url'),
          {}
        ));
      } else {
        parseCode = rule?.getDataValue('detail_find_rule');
        ({ url, params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.getDataValue('url'),
          {}
        ));
      }
      ({ url, params, data } = airParse.splitProtoUrl(request.query.url, {}));
      return airParse
        .parseDetailRule({
          url,
          params,
          method,
          data,
          parseCode,
          encoding,
          headers,
          preParseCode: rule.get('prerule'),
        })
        .catch((e) => {
          console.error(e);
          throw new Error(e.message);
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
