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
import { isNil } from 'lodash';
import ArticleListRule from '/@/apis/core/database/sqlite/models/articlelistrule';
import { getMyUrl, splitProtoUrl } from '#/utils';

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ParseQuery.GetLazyRuleResult;
    }
  > = {
    url: '/parse/getLazyRuleResult',
    method: 'POST',
    schema: {
      body: ParseQuery.GetLazyRuleResult,
    },
    handler: async (request) => {
      if (isNil(request.body.id) && isNil(request.body.originRule))
        throw new Error('必须包含 id 或 originRule');
      let url,
        params,
        data,
        encoding,
        method: Method = 'GET',
        headers;

      let rule: ArticleListRule | undefined | null;

      if (request.body.id) {
        rule = await articlelistrule.findByPk(Number(request.body.id), {
          rejectOnEmpty: true,
          raw: true,
        });
      } else if (request.body.originRule) {
        rule = request.body.originRule as any;
      }

      const home = await articlelistrule.findAll();

      if (!rule) throw new Error('规则不存在');
      const airParse = new AirParse(rule, home, (request as any).session || {});
      if (request.body.from === From['search']) {
        ({ url, params, data, encoding, method, headers } = splitProtoUrl(
          rule.search_url || rule.url,
          {}
        ));
      } else {
        ({ url, params, data, encoding, method, headers } = splitProtoUrl(rule.url, {}));
      }
      ({ url, params, data } = splitProtoUrl(request.body.url, {}));
      const myUrl = getMyUrl(request.body.url, {});
      return airParse
        .parseLazyRule({
          myUrl,
          url: url,
          params,
          method,
          data,
          parseCode: request.body.lazyRule,
          encoding,
          headers,
          fyPageParams: {},
          preParseCode: rule.prerule,
          input: request.body.url,
        })
        .then((res) => {
          return {
            data: res,
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
