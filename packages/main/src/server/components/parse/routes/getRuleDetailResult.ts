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
import { getMyUrl, splitProtoUrl } from '#/utils';
import { nanoid } from 'nanoid';

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
        raw: true,
      });

      const home = await articlelistrule.findAll();

      if (!rule) throw new Error('规则不存在');
      const airParse = new AirParse(rule, home, (request as any).session || {});
      let parseCode = '';
      if (request.query.from === From['search']) {
        const sdetail_find_rule = rule.sdetail_find_rule;
        parseCode = sdetail_find_rule === '*' ? rule.detail_find_rule : sdetail_find_rule;
        ({ url, params, data, encoding, method, headers } = splitProtoUrl(rule?.search_url, {}));
      } else {
        parseCode = rule?.detail_find_rule;
        ({ url, params, data, encoding, method, headers } = splitProtoUrl(rule?.url, {}));
      }
      ({ url, params, data } = splitProtoUrl(request.query.url, {}));
      const myUrl = getMyUrl(request.query.url, {});
      return airParse
        .parseDetailRule({
          myUrl,
          url,
          params,
          method,
          data,
          parseCode,
          encoding,
          headers,
          preParseCode: rule.prerule,
        })
        .then((res) => {
          return res.map((item) => ({ ...item, id: nanoid() }));
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
