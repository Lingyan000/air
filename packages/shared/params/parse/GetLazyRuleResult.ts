import { Static, Type } from '@sinclair/typebox';
import { From } from '../../enums';

const from = Type.Enum(From);

export const GetLazyRuleResult = Type.Object({
  id: Type.Number(),
  from: Type.Optional(from),
  url: Type.String(),
  lazyRule: Type.String(),
});

export type GetLazyRuleResult = Static<typeof GetLazyRuleResult>;
