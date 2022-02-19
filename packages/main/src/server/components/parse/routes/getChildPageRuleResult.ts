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
      Querystring: ParseQuery.GetChildPageRuleResult;
    }
  > = {
    url: '/parse/getChildPageRuleResult',
    method: 'GET',
    schema: {
      querystring: ParseQuery.GetChildPageRuleResult,
    },
    handler: async (request) => {
      let params,
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
        ({ params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.getDataValue('search_url'),
          {}
        ));
      } else {
        ({ params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.getDataValue('url'),
          {}
        ));
      }
      return airParse
        .parseChildPageRule({
          url: request.query.url,
          params,
          method,
          data,
          parseCode: '',
          encoding,
          headers,
          fyPageParams: {
            fypage: request.query.fypage,
          },
          preParseCode: rule.get('prerule'),
        })
        .catch((err) => {
          console.error(err);
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
