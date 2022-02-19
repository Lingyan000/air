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
      Querystring: ParseQuery.GetSearchRuleResult;
    }
  > = {
    url: '/parse/getSearchRuleResult',
    method: 'GET',
    schema: {
      querystring: ParseQuery.GetSearchRuleResult,
    },
    handler: async (request) => {
      const rule = await articlelistrule.findByPk(Number(request.query.id), {
        rejectOnEmpty: true,
      });

      const home = await articlelistrule.findAll();

      if (!rule) throw new Error('规则不存在');
      const airParse = new AirParse(rule, home, (request as any).session || {});
      const fyPageParams: FyPageParams = {
        fypage: request.query.fypage,
        search: request.query.search,
      };
      const {
        url,
        params: ruleParams,
        data,
        encoding,
        method,
        headers,
      } = airParse.splitProtoUrl(rule.get('search_url'), fyPageParams);
      return airParse
        .parseSearchRule({
          url: url,
          params: ruleParams,
          method,
          data,
          parseCode: rule.get('searchfind'),
          encoding,
          headers,
          fyPageParams,
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
