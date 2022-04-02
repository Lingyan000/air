import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import articlelistrule from '/@/apis/core/database/sqlite/models/articlelistrule';
import AirParse from '/@/apis/core/air/parse';
import { Parse as ParseQuery } from '#/params';
import { getMyUrl, splitProtoUrl } from '#/utils';

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
        raw: true,
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
      } = splitProtoUrl(rule.search_url, fyPageParams);
      const myUrl = getMyUrl(rule.search_url, fyPageParams);
      return airParse
        .parseSearchRule({
          myUrl,
          url: url,
          params: ruleParams,
          method,
          data,
          parseCode: rule.searchfind,
          encoding,
          headers,
          fyPageParams,
          preParseCode: rule.prerule,
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
