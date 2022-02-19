import { Static, Type } from '@sinclair/typebox';

export const GetSearchRuleResult = Type.Object({
  id: Type.Number(),
  fypage: Type.Optional(Type.String()),
  search: Type.String(),
});

export type GetSearchRuleResult = Static<typeof GetSearchRuleResult>;
