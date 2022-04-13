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
import { nanoid } from 'nanoid';

export default function getRoute() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Body: ParseQuery.GetCustomRuleResult;
    }
  > = {
    url: '/parse/getCustomRuleResult',
    method: 'POST',
    schema: {
      body: ParseQuery.GetCustomRuleResult,
    },
    handler: async (request) => {
      const rule = request.body;

      const home = await articlelistrule.findAll();

      const airParse = new AirParse(rule as any, home, (request as any).session || {});
      const parseCode = rule.find_rule;
      const { url, params, data, encoding, method = 'GET', headers } = splitProtoUrl(rule?.url, {});
      const myUrl = getMyUrl(rule?.url, {});
      return airParse
        .parseCustomRule({
          myUrl,
          url,
          params,
          method,
          data,
          parseCode,
          encoding,
          headers,
          preParseCode: rule.preRule,
        })
        .then((res) =>
          res.map((item) => ({
            ...item,
            col_type: item.col_type ? item.col_type : request.body.col_type,
          }))
        )
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
