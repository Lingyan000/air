import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteOptions,
} from 'fastify';
import { Articlelistrule as ArticlelistruleQuery } from '#/params';
import { getPasswordRuleType, isCloudShearPlate } from '/@/apis/core/utils/password';
import { ImportRule } from '/@/apis/core/utils/importRule';
import { PASSWORD_SIGN } from '#/config';
import { CloudShearPlate } from '/@/apis/core/utils/cloudShearPlate';
import * as Models from '#/models';

export default function importRule() {
  const route: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    {
      Reply: Models.Articlelistrule;
      Body: ArticlelistruleQuery.ImportRule;
    }
  > = {
    url: '/articlelistrule/import',
    method: 'POST',
    schema: {
      body: ArticlelistruleQuery.ImportRule,
    },
    handler: async (request) => {
      if (!request.body.password) throw new Error('规则不能为空');
      let password = request.body.password;
      const isCloud = isCloudShearPlate(password);
      if (isCloud) {
        const cloudShearPlate = new CloudShearPlate(password.split('\n')[0]);
        password = await cloudShearPlate.getRes();
      }
      const type = getPasswordRuleType(password);
      const rule = password.match(new RegExp(`.*${PASSWORD_SIGN[type].sign}(.*)`))![1] || '';
      const importRule = new ImportRule(type, rule);
      return await importRule.import();
    },
  };

  return route;
}
