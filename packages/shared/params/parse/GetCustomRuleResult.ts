import { Static, Type } from '@sinclair/typebox';

export const GetCustomRuleResult = Type.Object({
  title: Type.String(),
  url: Type.String(),
  col_type: Type.String(),
  find_rule: Type.String(),
  group: Type.String(),
  ua: Type.String(),
  preRule: Type.String(),
});

export type GetCustomRuleResult = Static<typeof GetCustomRuleResult>;
