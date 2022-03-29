import { Static, Type } from '@sinclair/typebox';
import { From } from '../../enums';

const from = Type.Enum(From);

export const GetRuleResult = Type.Object({
  id: Type.Optional(Type.Number()),
  from: Type.Optional(from),
  url: Type.String(),
  rule: Type.String(),
  originRule: Type.Optional(Type.Any()),
});

export type GetRuleResult = Static<typeof GetRuleResult>;
