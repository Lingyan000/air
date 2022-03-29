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

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ParseQuery.GetChildPageRuleResult;
    }
  > = {
    url: '/parse/getChildPageRuleResult',
    method: 'POST',
    schema: {
      body: ParseQuery.GetChildPageRuleResult,
    },
    handler: async (request) => {
      if (isNil(request.body.id) && isNil(request.body.originRule))
        throw new Error('必须包含 id 或 originRule');
      let params,
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
        ({ params, data, encoding, method, headers } = airParse.splitProtoUrl(
          rule?.search_url || rule?.url,
          {}
        ));
      } else {
        ({ params, data, encoding, method, headers } = airParse.splitProtoUrl(rule?.url, {}));
      }
      return airParse
        .parseChildPageRule({
          url: request.body.url,
          params,
          method,
          data,
          parseCode: '',
          encoding,
          headers,
          fyPageParams: {
            fypage: request.body.fypage,
          },
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
